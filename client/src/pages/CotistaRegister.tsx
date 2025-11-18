import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Upload, CheckCircle2, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { toast } from "sonner";

export default function CotistaRegister() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();
  
  const [developmentId, setDevelopmentId] = useState("");
  const [fractionNumber, setFractionNumber] = useState("");
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [ownershipProof, setOwnershipProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    identity: null as string | null,
    address: null as string | null,
    ownership: null as string | null,
  });

  const { data: developments } = trpc.developments.getAll.useQuery();
  const uploadMutation = trpc.documents.uploadCotistaDocument.useMutation();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (
    type: 'identity' | 'address_proof' | 'ownership_proof',
    file: File
  ) => {
    try {
      const base64Data = await fileToBase64(file);
      
      const result = await uploadMutation.mutateAsync({
        documentType: type,
        fileData: base64Data,
        fileName: file.name,
        contentType: file.type,
      });

      setUploadedDocs(prev => ({ ...prev, [type]: result.fileUrl }));
      toast.success(t('document_uploaded', 'Document uploaded successfully'));
    } catch (error) {
      toast.error(t('upload_failed', 'Upload failed. Please try again.'));
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!developmentId || !fractionNumber) {
      toast.error(t('fill_all_fields', 'Please fill all required fields'));
      return;
    }

    if (!uploadedDocs.identity || !uploadedDocs.address || !uploadedDocs.ownership) {
      toast.error(t('upload_all_documents', 'Please upload all required documents'));
      return;
    }

    setUploading(true);
    try {
      // Here we would call a mutation to create the cotista record
      // For now, just show success message
      toast.success(t('registration_submitted', 'Registration submitted for review'));
      setTimeout(() => {
        setLocation('/cotista/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('registration_failed', 'Registration failed. Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('cotista_registration', 'Fractional Owner Registration')}
          </h1>
          <p className="text-muted-foreground">
            {t('cotista_registration_desc', 'Register as a fractional owner to list your property availability')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t('property_information', 'Property Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="development">{t('development', 'Development')}</Label>
                <Select value={developmentId} onValueChange={setDevelopmentId}>
                  <SelectTrigger id="development">
                    <SelectValue placeholder={t('select_development', 'Select development')} />
                  </SelectTrigger>
                  <SelectContent>
                    {developments?.map((dev) => (
                      <SelectItem key={dev.development.id} value={dev.development.id.toString()}>
                        {t(dev.development.nameKey, dev.development.nameKey)} - {t(dev.city.nameKey, dev.city.nameKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fraction">{t('fraction_number', 'Fraction Number')}</Label>
                <Input
                  id="fraction"
                  type="text"
                  placeholder={t('enter_fraction', 'Enter your fraction number')}
                  value={fractionNumber}
                  onChange={(e) => setFractionNumber(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Identity Document */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('identity_document', 'Identity Document')}
                {uploadedDocs.identity && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                {t('identity_document_desc', 'Upload a photo of your passport, driver\'s license, or national ID card')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="identity-doc">{t('select_file', 'Select file')}</Label>
                <Input
                  id="identity-doc"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdentityDoc(e.target.files?.[0] || null)}
                  disabled={uploading || !!uploadedDocs.identity}
                />
              </div>
              {identityDoc && !uploadedDocs.identity && (
                <Button
                  onClick={() => handleUpload('identity', identityDoc)}
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
                {t('address_proof_desc', 'Upload a recent utility bill, bank statement, or government document')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address-proof">{t('select_file', 'Select file')}</Label>
                <Input
                  id="address-proof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setAddressProof(e.target.files?.[0] || null)}
                  disabled={uploading || !!uploadedDocs.address}
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

          {/* Ownership Proof */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('ownership_proof', 'Proof of Ownership')}
                {uploadedDocs.ownership && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                {t('ownership_proof_desc', 'Upload your property deed, purchase agreement, or ownership certificate')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ownership-proof">{t('select_file', 'Select file')}</Label>
                <Input
                  id="ownership-proof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setOwnershipProof(e.target.files?.[0] || null)}
                  disabled={uploading || !!uploadedDocs.ownership}
                />
              </div>
              {ownershipProof && !uploadedDocs.ownership && (
                <Button
                  onClick={() => handleUpload('ownership_proof', ownershipProof)}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('upload', 'Upload')}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={
                  uploading ||
                  !developmentId ||
                  !fractionNumber ||
                  !uploadedDocs.identity ||
                  !uploadedDocs.address ||
                  !uploadedDocs.ownership
                }
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('submitting', 'Submitting...')}
                  </>
                ) : (
                  t('submit_registration', 'Submit Registration')
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
