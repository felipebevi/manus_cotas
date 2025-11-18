import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { Loader2, Upload, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { toast } from "sonner";

export default function DocumentUpload() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{ id: boolean; address: boolean }>({
    id: false,
    address: false,
  });

  const { data: reservation, isLoading } = trpc.reservations.getById.useQuery({
    id: parseInt(reservationId || "0"),
  });

  const uploadMutation = trpc.documents.uploadCustomerDocument.useMutation();

  const handleFileChange = (type: 'id' | 'address', file: File | null) => {
    if (type === 'id') {
      setIdDocument(file);
    } else {
      setAddressProof(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:*/*;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (type: 'id' | 'address_proof', file: File) => {
    try {
      const base64Data = await fileToBase64(file);
      
      await uploadMutation.mutateAsync({
        reservationId: parseInt(reservationId || "0"),
        documentType: type,
        fileData: base64Data,
        fileName: file.name,
        contentType: file.type,
      });

      if (type === 'id') {
        setUploadedDocs(prev => ({ ...prev, id: true }));
      } else {
        setUploadedDocs(prev => ({ ...prev, address: true }));
      }

      toast.success(t('document_uploaded', 'Document uploaded successfully'));
    } catch (error) {
      toast.error(t('upload_failed', 'Upload failed. Please try again.'));
      throw error;
    }
  };

  const handleSubmitAll = async () => {
    if (!idDocument || !addressProof) {
      toast.error(t('select_all_documents', 'Please select all required documents'));
      return;
    }

    setUploading(true);
    try {
      if (!uploadedDocs.id) {
        await handleUpload('id', idDocument);
      }
      if (!uploadedDocs.address) {
        await handleUpload('address_proof', addressProof);
      }

      toast.success(t('documents_submitted', 'All documents submitted successfully'));
      setTimeout(() => {
        setLocation(`/reservation/${reservationId}/success`);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('reservation_not_found', 'Reservation not found')}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const allUploaded = uploadedDocs.id && uploadedDocs.address;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('upload_documents', 'Upload Documents')}
          </h1>
          <p className="text-muted-foreground">
            {t('upload_documents_desc', 'Please upload the required documents to complete your reservation')}
          </p>
        </div>

        <div className="space-y-6">
          {/* ID Document */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('id_document', 'Identity Document')}
                {uploadedDocs.id && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                {t('id_document_desc', 'Upload a photo of your passport, driver\'s license, or national ID card')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="id-document">{t('select_file', 'Select file')}</Label>
                <Input
                  id="id-document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('id', e.target.files?.[0] || null)}
                  disabled={uploading}
                />
              </div>
              {idDocument && !uploadedDocs.id && (
                <Button
                  onClick={() => handleUpload('id', idDocument)}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('upload', 'Upload')}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Address Proof */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('address_proof', 'Proof of Address')}
                {uploadedDocs.address && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                {t('address_proof_desc', 'Upload a recent utility bill, bank statement, or government document showing your address')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address-proof">{t('select_file', 'Select file')}</Label>
                <Input
                  id="address-proof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('address', e.target.files?.[0] || null)}
                  disabled={uploading}
                />
              </div>
              {addressProof && !uploadedDocs.address && (
                <Button
                  onClick={() => handleUpload('address_proof', addressProof)}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('upload', 'Upload')}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Submit All */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              {allUploaded ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    {t('documents_uploaded_success', 'All documents have been uploaded successfully. Our team will review them shortly.')}
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleSubmitAll}
                  disabled={uploading || !idDocument || !addressProof}
                  className="w-full"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('uploading', 'Uploading...')}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('submit_all_documents', 'Submit All Documents')}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {allUploaded && (
            <div className="text-center">
              <Button
                onClick={() => setLocation(`/reservation/${reservationId}/success`)}
                variant="outline"
              >
                {t('continue', 'Continue')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
