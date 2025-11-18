import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { Loader2, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function CityListing() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const { t } = useI18n();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("price_asc");

  const { data: city } = trpc.geography.getCityBySlug.useQuery({
    slug: citySlug || "",
  });

  const { data: developments, isLoading } = trpc.developments.getByCity.useQuery({
    cityId: city?.id || 0,
  }, {
    enabled: !!city,
  });

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

  const sortedDevelopments = [...(developments || [])].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.startingPrice - b.startingPrice;
      case "price_desc":
        return b.startingPrice - a.startingPrice;
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      default:
        return 0;
    }
  });

  const filteredDevelopments = sortedDevelopments.filter((dev) => {
    const price = dev.startingPrice / 100;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t('city_developments', 'Developments')}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {filteredDevelopments.length} {t('developments_found', 'developments found')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">{t('filter_sort', 'Sort by')}</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">{t('sort_price_low', 'Price: Low to High')}</SelectItem>
                      <SelectItem value="price_desc">{t('sort_price_high', 'Price: High to Low')}</SelectItem>
                      <SelectItem value="rating">{t('sort_rating', 'Highest Rated')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">{t('filter_price', 'Price Range')}</h3>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Development List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDevelopments.map((dev) => (
                <Card key={dev.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {/* Placeholder for photo - will be replaced with actual photos */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-12 w-12" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {t(dev.nameKey, dev.nameKey)}
                      </h3>
                      {dev.rating && parseFloat(dev.rating) > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          {parseFloat(dev.rating).toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {t(dev.shortDescriptionKey, dev.shortDescriptionKey)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('starting_from', 'Starting from')}</p>
                        <p className="text-xl font-bold">${(dev.startingPrice / 100).toFixed(2)}</p>
                      </div>
                      <Button asChild>
                        <Link href={`/development/${dev.slug}`}>
                          <a>{t('view_details', 'View Details')}</a>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDevelopments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('no_developments', 'No developments found')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
