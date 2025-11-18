import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function ReservationPayment() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const { t } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: reservationData, isLoading } = trpc.reservations.getById.useQuery({
    id: parseInt(reservationId || "0"),
  });

  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();

  const handlePayment = async () => {
    if (!reservationData) return;

    setIsProcessing(true);

    try {
      const result = await createCheckoutMutation.mutateAsync({
        reservationId: reservationData.reservation.id,
        developmentId: reservationData.reservation.developmentId,
      });

      if (result.url) {
        // Open Stripe Checkout in new tab
        window.open(result.url, '_blank');
        toast.info(t('redirecting_to_payment', 'Redirecting to payment page...'));
      }
    } catch (error: any) {
      toast.error(error.message || t('payment_error', 'Failed to process payment'));
    } finally {
      setIsProcessing(false);
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

  if (!reservationData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <p className="text-center text-muted-foreground">{t('reservation_not_found', 'Reservation not found')}</p>
        </div>
      </div>
    );
  }

  const { reservation } = reservationData;
  const totalAmount = (reservation.totalPrice / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('complete_payment', 'Complete Your Payment')}</h1>

          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t('payment_summary', 'Payment Summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('reservation_id', 'Reservation ID')}</span>
                  <span className="font-mono">#{reservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('check_in', 'Check-in')}</span>
                  <span>{new Date(reservation.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('check_out', 'Check-out')}</span>
                  <span>{new Date(reservation.endDate).toLocaleDateString()}</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">{t('total_amount', 'Total Amount')}</span>
                  <span className="text-2xl font-bold">${totalAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t('payment_method', 'Payment Method')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{t('secure_payment', 'Secure Payment with Stripe')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('secure_payment_desc', 'Your payment information is encrypted and secure')}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('processing', 'Processing...')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {t('pay_now', 'Pay Now')} ${totalAmount}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t('test_card_info', 'Test card: 4242 4242 4242 4242')}
                </p>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">{t('what_happens_next', 'What happens next?')}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('payment_step_1', 'Complete your payment securely through Stripe')}</li>
                      <li>• {t('payment_step_2', 'Upload required documents for verification')}</li>
                      <li>• {t('payment_step_3', 'Receive your voucher after admin approval')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
