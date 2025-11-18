import { storagePut } from './storage';
import { randomBytes } from 'crypto';

export interface UploadedFile {
  fileKey: string;
  fileUrl: string;
  fileName: string;
  contentType: string;
  size: number;
}

/**
 * Upload a file to S3 storage
 * @param file - File buffer
 * @param userId - User ID for organizing files
 * @param category - Category (e.g., 'documents', 'vouchers', 'photos')
 * @param fileName - Original file name
 * @param contentType - MIME type
 * @returns Upload result with file key and URL
 */
export async function uploadFile(
  file: Buffer,
  userId: number,
  category: string,
  fileName: string,
  contentType: string
): Promise<UploadedFile> {
  // Generate random suffix to prevent enumeration
  const randomSuffix = randomBytes(8).toString('hex');
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Build file key: category/userId/timestamp-random-filename
  const fileKey = `${category}/${userId}/${timestamp}-${randomSuffix}-${sanitizedFileName}`;
  
  // Upload to S3
  const { key, url } = await storagePut(fileKey, file, contentType);
  
  return {
    fileKey: key,
    fileUrl: url,
    fileName: sanitizedFileName,
    contentType,
    size: file.length,
  };
}

/**
 * Validate file type and size
 */
export function validateFile(
  contentType: string,
  size: number,
  allowedTypes: string[],
  maxSizeMB: number
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.some(type => contentType.includes(type))) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Allowed document types
 */
export const DOCUMENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

/**
 * Maximum file size for documents (10MB)
 */
export const MAX_DOCUMENT_SIZE_MB = 10;
