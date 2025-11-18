import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Loader2, MapPin, Star, Wifi, Car, Utensils, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  restaurant: Utensils,
  gym: Dumbbell,
};

export default function DevelopmentDetails() {
  const { developmentSlug } = useParams<{ developmentSlug: string }>();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data, isLoading } = trpc.developments.getBySlug.useQuery({
    slug: developmentSlug || "",
  });

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else {
      setLocation(`/reserve/${developmentSlug}`);
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

  if (!data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <p className="text-center text-muted-foreground">{t('development_not_found', 'Development not found')}</p>
        </div>
      </div>
    );
  }

  const { development, photos, amenities, businesses } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {photos.length > 0 ? (
            <>
              <div className="md:col-span-2 aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src={photos[0].url} 
                  alt={t(development.nameKey, development.nameKey)}
                  className="w-full h-full object-cover"
                />
              </div>
              {photos.slice(1, 5).map((photo) => (
                <div key={photo.id} className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={t(development.nameKey, development.nameKey)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="md:col-span-2 aspect-video bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold">
                  {t(development.nameKey, development.nameKey)}
                </h1>
                {development.rating && parseFloat(development.rating) > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-lg px-3 py-1">
                    <Star className="h-4 w-4 fill-current" />
                    {parseFloat(development.rating).toFixed(1)}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {development.address}
              </p>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('about', 'About this property')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t(development.descriptionKey, development.descriptionKey)}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-semibold mb-4">{t('amenities', 'Amenities')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity.category || ''] || Wifi;
                      return (
                        <div key={amenity.id} className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span>{t(amenity.nameKey, amenity.nameKey)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Location Map */}
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('location', 'Location')}</h2>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">{t('map_placeholder', 'Map will be displayed here')}</p>
              </div>
            </div>

            {/* Sponsored Businesses */}
            {businesses.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-semibold mb-4">{t('nearby_businesses', 'Nearby Businesses')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businesses.map((business) => (
                      <Card key={business.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">
                            {t(business.nameKey, business.nameKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {t(business.descriptionKey, business.descriptionKey)}
                          </p>
                          <Badge variant="outline">{business.category}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${(development.startingPrice / 100).toFixed(2)}</span>
                  <span className="text-sm font-normal text-muted-foreground">/ {t('night', 'night')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleReserveClick}
                  className="w-full"
                  size="lg"
                >
                  {t('reserve_now', 'Reserve Now')}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {t('no_charge_yet', "You won't be charged yet")}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('availability', 'Availability')}</span>
                    <span className="font-medium">{t('check_calendar', 'Check calendar')}</span>
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
