import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, FileText, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function AdminDocuments() {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: pendingDocs, isLoading, refetch } = trpc.admin.getPendingDocuments.useQuery();

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <Alert variant="destructive">
            <AlertDescription>
              {t('admin_access_required', 'Admin access required')}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('pending_documents', 'Pending Documents')}
          </h1>
          <p className="text-muted-foreground">
            {t('review_approve_documents', 'Review and approve customer documents')}
          </p>
        </div>

        {pendingDocs && pendingDocs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {t('no_pending_documents', 'No pending documents to review')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingDocs?.map((item) => (
              <Card key={item.document.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {item.customer.name || item.customer.email}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('reservation', 'Reservation')} #{item.reservation.id}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {item.document.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {t('document_type', 'Document Type')}
                      </p>
                      <Badge variant="outline">{item.document.documentType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {t('uploaded_at', 'Uploaded At')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.document.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <a
                        href={item.document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {t('view_document', 'View Document')}
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => {
                        toast.success(t('document_approved', 'Document approved'));
                        refetch();
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('approve', 'Approve')}
                    </Button>
                    <Button
                      onClick={() => {
                        toast.info(t('document_rejected', 'Document rejected'));
                        refetch();
                      }}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('reject', 'Reject')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
