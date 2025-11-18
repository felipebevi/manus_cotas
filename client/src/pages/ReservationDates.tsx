import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { Loader2, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ReservationDates() {
  const { developmentSlug } = useParams<{ developmentSlug: string }>();
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: developmentData, isLoading } = trpc.developments.getBySlug.useQuery({
    slug: developmentSlug || "",
  });

  const handleCreateReservation = async () => {
    if (!startDate || !endDate) {
      toast.error(t('error_select_dates', 'Please select check-in and check-out dates'));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      toast.error(t('error_invalid_dates', 'Check-out date must be after check-in date'));
      return;
    }

    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = (developmentData?.development.startingPrice || 0) * nights;

    setIsCreating(true);

    try {
      // In a real implementation, this would call a tRPC mutation to create the reservation
      // For now, we'll simulate it
      toast.success(t('reservation_created', 'Reservation created successfully'));
      
      // Redirect to payment page (we'll create a mock reservation ID)
      const mockReservationId = Math.floor(Math.random() * 1000);
      setLocation(`/reservation/${mockReservationId}/payment`);
    } catch (error) {
      toast.error(t('error_creating_reservation', 'Failed to create reservation'));
    } finally {
      setIsCreating(false);
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

  if (!developmentData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <p className="text-center text-muted-foreground">{t('development_not_found', 'Development not found')}</p>
        </div>
      </div>
    );
  }

  const { development } = developmentData;
  const nights = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights > 0 ? (development.startingPrice / 100) * nights : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('select_dates', 'Select Your Dates')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Date Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t('reservation_details', 'Reservation Details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">{t(development.nameKey, development.nameKey)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t(development.shortDescriptionKey, development.shortDescriptionKey)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">{t('check_in', 'Check-in Date')}</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">{t('check_out', 'Check-out Date')}</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {nights} {t('nights', 'night(s)')} × ${(development.startingPrice / 100).toFixed(2)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {t('price_summary', 'Price Summary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nights > 0 ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('subtotal', 'Subtotal')}</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('service_fee', 'Service Fee')}</span>
                          <span>$0.00</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between font-bold text-lg">
                          <span>{t('total', 'Total')}</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handleCreateReservation}
                        disabled={isCreating}
                        className="w-full"
                        size="lg"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('processing', 'Processing...')}
                          </>
                        ) : (
                          t('continue_to_payment', 'Continue to Payment')
                        )}
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      {t('select_dates_to_see_price', 'Select dates to see total price')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
