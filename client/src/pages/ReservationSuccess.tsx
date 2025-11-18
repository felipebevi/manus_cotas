import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, FileText, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReservationSuccess() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{t('payment_successful', 'Payment Successful!')}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t('payment_success_message', 'Your reservation has been confirmed and payment processed successfully.')}
          </p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">{t('reservation_id', 'Reservation ID')}</span>
                  <span className="font-mono text-lg">#{reservationId}</span>
                </div>

                <div className="text-left space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('next_steps', 'Next Steps')}
                  </h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      <span>{t('next_step_1', 'Upload your identification documents for verification')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      <span>{t('next_step_2', 'Wait for admin approval (usually within 24-48 hours)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary">3.</span>
                      <span>{t('next_step_3', 'Receive your voucher and enjoy your stay!')}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={`/reservation/${reservationId}/documents`}>
                <a className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('upload_documents', 'Upload Documents')}
                </a>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/my-reservations">
                <a className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {t('view_reservations', 'View My Reservations')}
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
