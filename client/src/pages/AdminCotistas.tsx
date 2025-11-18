import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, CheckCircle, XCircle, Ban, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function AdminCotistas() {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: pendingCotistas, isLoading, refetch } = trpc.admin.getPendingCotistas.useQuery();

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
            {t('pending_cotistas', 'Pending Cotistas')}
          </h1>
          <p className="text-muted-foreground">
            {t('review_approve_cotistas', 'Review and approve fractional owner registrations')}
          </p>
        </div>

        {pendingCotistas && pendingCotistas.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {t('no_pending_cotistas', 'No pending cotista registrations')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingCotistas?.map((item) => (
              <Card key={item.cotista.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {item.user.name || item.user.email}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(item.development.nameKey, item.development.nameKey)}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {item.cotista.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {t('user_id', 'User ID')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        #{item.cotista.userId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {t('registered_at', 'Registered At')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.cotista.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {t('email', 'Email')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button
                      onClick={() => {
                        toast.success(t('cotista_approved', 'Cotista approved'));
                        refetch();
                      }}
                      className="flex-1 min-w-[150px]"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('approve', 'Approve')}
                    </Button>
                    <Button
                      onClick={() => {
                        toast.info(t('cotista_rejected', 'Cotista rejected'));
                        refetch();
                      }}
                      variant="destructive"
                      className="flex-1 min-w-[150px]"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('reject', 'Reject')}
                    </Button>
                    <Button
                      onClick={() => {
                        toast.info(t('cotista_suspended', 'Cotista suspended'));
                        refetch();
                      }}
                      variant="outline"
                      className="flex-1 min-w-[150px]"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      {t('suspend', 'Suspend')}
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
