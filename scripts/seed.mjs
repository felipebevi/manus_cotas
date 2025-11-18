import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🌱 Starting database seed...');

// Clear existing data (in reverse order of dependencies)
console.log('Clearing existing data...');
await db.delete(schema.businessCities);
await db.delete(schema.businessDevelopments);
await db.delete(schema.developmentAmenities);
await db.delete(schema.developmentPhotos);
await db.delete(schema.sponsoredBusinesses);
await db.delete(schema.amenities);
await db.delete(schema.developments);
await db.delete(schema.cities);
await db.delete(schema.states);
await db.delete(schema.countries);
await db.delete(schema.translations);

// 1. Translations
console.log('Seeding translations...');
const translations = [
  // Countries
  { key: 'country_usa', language: 'en', value: 'United States', category: 'geography' },
  { key: 'country_usa', language: 'pt', value: 'Estados Unidos', category: 'geography' },
  { key: 'country_usa', language: 'es', value: 'Estados Unidos', category: 'geography' },
  
  { key: 'country_bra', language: 'en', value: 'Brazil', category: 'geography' },
  { key: 'country_bra', language: 'pt', value: 'Brasil', category: 'geography' },
  { key: 'country_bra', language: 'es', value: 'Brasil', category: 'geography' },
  
  { key: 'country_fra', language: 'en', value: 'France', category: 'geography' },
  { key: 'country_fra', language: 'pt', value: 'França', category: 'geography' },
  { key: 'country_fra', language: 'es', value: 'Francia', category: 'geography' },
  { key: 'country_fra', language: 'fr', value: 'France', category: 'geography' },
  
  // States
  { key: 'state_florida', language: 'en', value: 'Florida', category: 'geography' },
  { key: 'state_florida', language: 'pt', value: 'Flórida', category: 'geography' },
  { key: 'state_florida', language: 'es', value: 'Florida', category: 'geography' },
  
  { key: 'state_california', language: 'en', value: 'California', category: 'geography' },
  { key: 'state_california', language: 'pt', value: 'Califórnia', category: 'geography' },
  { key: 'state_california', language: 'es', value: 'California', category: 'geography' },
  
  { key: 'state_rio', language: 'en', value: 'Rio de Janeiro', category: 'geography' },
  { key: 'state_rio', language: 'pt', value: 'Rio de Janeiro', category: 'geography' },
  { key: 'state_rio', language: 'es', value: 'Río de Janeiro', category: 'geography' },
  
  { key: 'state_provence', language: 'en', value: 'Provence', category: 'geography' },
  { key: 'state_provence', language: 'pt', value: 'Provença', category: 'geography' },
  { key: 'state_provence', language: 'es', value: 'Provenza', category: 'geography' },
  { key: 'state_provence', language: 'fr', value: 'Provence', category: 'geography' },
  
  // Cities
  { key: 'city_miami', language: 'en', value: 'Miami', category: 'geography' },
  { key: 'city_miami', language: 'pt', value: 'Miami', category: 'geography' },
  { key: 'city_miami', language: 'es', value: 'Miami', category: 'geography' },
  
  { key: 'city_los_angeles', language: 'en', value: 'Los Angeles', category: 'geography' },
  { key: 'city_los_angeles', language: 'pt', value: 'Los Angeles', category: 'geography' },
  { key: 'city_los_angeles', language: 'es', value: 'Los Ángeles', category: 'geography' },
  
  { key: 'city_rio', language: 'en', value: 'Rio de Janeiro', category: 'geography' },
  { key: 'city_rio', language: 'pt', value: 'Rio de Janeiro', category: 'geography' },
  { key: 'city_rio', language: 'es', value: 'Río de Janeiro', category: 'geography' },
  
  { key: 'city_nice', language: 'en', value: 'Nice', category: 'geography' },
  { key: 'city_nice', language: 'pt', value: 'Nice', category: 'geography' },
  { key: 'city_nice', language: 'es', value: 'Niza', category: 'geography' },
  { key: 'city_nice', language: 'fr', value: 'Nice', category: 'geography' },
  
  // Developments
  { key: 'dev_miami_beach_resort', language: 'en', value: 'Miami Beach Resort', category: 'development' },
  { key: 'dev_miami_beach_resort', language: 'pt', value: 'Resort Miami Beach', category: 'development' },
  { key: 'dev_miami_beach_resort', language: 'es', value: 'Resort Miami Beach', category: 'development' },
  
  { key: 'dev_miami_beach_resort_short', language: 'en', value: 'Luxury beachfront resort with ocean views', category: 'development' },
  { key: 'dev_miami_beach_resort_short', language: 'pt', value: 'Resort de luxo à beira-mar com vista para o oceano', category: 'development' },
  { key: 'dev_miami_beach_resort_short', language: 'es', value: 'Resort de lujo frente al mar con vistas al océano', category: 'development' },
  
  { key: 'dev_miami_beach_resort_desc', language: 'en', value: 'Experience the ultimate luxury at our Miami Beach Resort. Located directly on the pristine white sands of Miami Beach, this exclusive property offers breathtaking ocean views, world-class amenities, and unparalleled service. Perfect for families and couples seeking an unforgettable vacation experience.', category: 'development' },
  { key: 'dev_miami_beach_resort_desc', language: 'pt', value: 'Experimente o máximo em luxo no nosso Resort Miami Beach. Localizado diretamente nas areias brancas pristinas de Miami Beach, esta propriedade exclusiva oferece vistas deslumbrantes do oceano, comodidades de classe mundial e serviço incomparável. Perfeito para famílias e casais que buscam uma experiência de férias inesquecível.', category: 'development' },
  { key: 'dev_miami_beach_resort_desc', language: 'es', value: 'Experimente el máximo lujo en nuestro Resort Miami Beach. Ubicado directamente en las arenas blancas prístinas de Miami Beach, esta propiedad exclusiva ofrece impresionantes vistas al océano, comodidades de clase mundial y servicio incomparable. Perfecto para familias y parejas que buscan una experiencia de vacaciones inolvidable.', category: 'development' },
  
  { key: 'dev_hollywood_hills_villa', language: 'en', value: 'Hollywood Hills Villa', category: 'development' },
  { key: 'dev_hollywood_hills_villa', language: 'pt', value: 'Villa Hollywood Hills', category: 'development' },
  { key: 'dev_hollywood_hills_villa', language: 'es', value: 'Villa Hollywood Hills', category: 'development' },
  
  { key: 'dev_hollywood_hills_villa_short', language: 'en', value: 'Modern villa with panoramic city views', category: 'development' },
  { key: 'dev_hollywood_hills_villa_short', language: 'pt', value: 'Villa moderna com vistas panorâmicas da cidade', category: 'development' },
  { key: 'dev_hollywood_hills_villa_short', language: 'es', value: 'Villa moderna con vistas panorámicas de la ciudad', category: 'development' },
  
  { key: 'dev_hollywood_hills_villa_desc', language: 'en', value: 'Perched high in the Hollywood Hills, this stunning modern villa offers spectacular panoramic views of Los Angeles. Featuring contemporary design, infinity pool, home theater, and gourmet kitchen. Minutes from Beverly Hills and Sunset Boulevard.', category: 'development' },
  { key: 'dev_hollywood_hills_villa_desc', language: 'pt', value: 'Situada no alto das Hollywood Hills, esta deslumbrante villa moderna oferece vistas panorâmicas espetaculares de Los Angeles. Com design contemporâneo, piscina infinita, cinema em casa e cozinha gourmet. A minutos de Beverly Hills e Sunset Boulevard.', category: 'development' },
  { key: 'dev_hollywood_hills_villa_desc', language: 'es', value: 'Situada en lo alto de Hollywood Hills, esta impresionante villa moderna ofrece espectaculares vistas panorámicas de Los Ángeles. Con diseño contemporáneo, piscina infinita, cine en casa y cocina gourmet. A minutos de Beverly Hills y Sunset Boulevard.', category: 'development' },
  
  { key: 'dev_copacabana_penthouse', language: 'en', value: 'Copacabana Penthouse', category: 'development' },
  { key: 'dev_copacabana_penthouse', language: 'pt', value: 'Cobertura Copacabana', category: 'development' },
  { key: 'dev_copacabana_penthouse', language: 'es', value: 'Ático Copacabana', category: 'development' },
  
  { key: 'dev_copacabana_penthouse_short', language: 'en', value: 'Exclusive penthouse on Copacabana Beach', category: 'development' },
  { key: 'dev_copacabana_penthouse_short', language: 'pt', value: 'Cobertura exclusiva na Praia de Copacabana', category: 'development' },
  { key: 'dev_copacabana_penthouse_short', language: 'es', value: 'Ático exclusivo en la Playa de Copacabana', category: 'development' },
  
  { key: 'dev_copacabana_penthouse_desc', language: 'en', value: 'Live the dream in this exclusive penthouse overlooking the iconic Copacabana Beach. This luxurious property features floor-to-ceiling windows, private rooftop terrace, and direct beach access. Experience the vibrant culture of Rio de Janeiro in style.', category: 'development' },
  { key: 'dev_copacabana_penthouse_desc', language: 'pt', value: 'Viva o sonho nesta cobertura exclusiva com vista para a icônica Praia de Copacabana. Esta propriedade luxuosa possui janelas do chão ao teto, terraço privativo na cobertura e acesso direto à praia. Experimente a vibrante cultura do Rio de Janeiro com estilo.', category: 'development' },
  { key: 'dev_copacabana_penthouse_desc', language: 'es', value: 'Vive el sueño en este ático exclusivo con vistas a la icónica Playa de Copacabana. Esta propiedad lujosa cuenta con ventanas de piso a techo, terraza privada en la azotea y acceso directo a la playa. Experimenta la vibrante cultura de Río de Janeiro con estilo.', category: 'development' },
  
  { key: 'dev_french_riviera_chateau', language: 'en', value: 'French Riviera Château', category: 'development' },
  { key: 'dev_french_riviera_chateau', language: 'pt', value: 'Château da Riviera Francesa', category: 'development' },
  { key: 'dev_french_riviera_chateau', language: 'es', value: 'Château de la Riviera Francesa', category: 'development' },
  { key: 'dev_french_riviera_chateau', language: 'fr', value: 'Château de la Côte d\'Azur', category: 'development' },
  
  { key: 'dev_french_riviera_chateau_short', language: 'en', value: 'Historic château with Mediterranean views', category: 'development' },
  { key: 'dev_french_riviera_chateau_short', language: 'pt', value: 'Château histórico com vistas do Mediterrâneo', category: 'development' },
  { key: 'dev_french_riviera_chateau_short', language: 'es', value: 'Château histórico con vistas al Mediterráneo', category: 'development' },
  { key: 'dev_french_riviera_chateau_short', language: 'fr', value: 'Château historique avec vue sur la Méditerranée', category: 'development' },
  
  { key: 'dev_french_riviera_chateau_desc', language: 'en', value: 'Step into elegance at this beautifully restored 18th-century château overlooking the azure waters of the Mediterranean. Set in private gardens with olive groves and lavender fields, this property offers the perfect blend of historic charm and modern luxury.', category: 'development' },
  { key: 'dev_french_riviera_chateau_desc', language: 'pt', value: 'Entre na elegância neste château do século XVIII lindamente restaurado com vista para as águas azuis do Mediterrâneo. Situado em jardins privados com olivais e campos de lavanda, esta propriedade oferece a combinação perfeita de charme histórico e luxo moderno.', category: 'development' },
  { key: 'dev_french_riviera_chateau_desc', language: 'es', value: 'Entre en la elegancia en este château del siglo XVIII bellamente restaurado con vistas a las aguas azules del Mediterráneo. Situado en jardines privados con olivares y campos de lavanda, esta propiedad ofrece la combinación perfecta de encanto histórico y lujo moderno.', category: 'development' },
  { key: 'dev_french_riviera_chateau_desc', language: 'fr', value: 'Entrez dans l\'élégance de ce château du XVIIIe siècle magnifiquement restauré surplombant les eaux azurées de la Méditerranée. Situé dans des jardins privés avec des oliveraies et des champs de lavande, cette propriété offre le mélange parfait de charme historique et de luxe moderne.', category: 'development' },
  
  // Amenities
  { key: 'amenity_pool', language: 'en', value: 'Swimming Pool', category: 'amenity' },
  { key: 'amenity_pool', language: 'pt', value: 'Piscina', category: 'amenity' },
  { key: 'amenity_pool', language: 'es', value: 'Piscina', category: 'amenity' },
  
  { key: 'amenity_wifi', language: 'en', value: 'High-Speed WiFi', category: 'amenity' },
  { key: 'amenity_wifi', language: 'pt', value: 'WiFi de Alta Velocidade', category: 'amenity' },
  { key: 'amenity_wifi', language: 'es', value: 'WiFi de Alta Velocidad', category: 'amenity' },
  
  { key: 'amenity_gym', language: 'en', value: 'Fitness Center', category: 'amenity' },
  { key: 'amenity_gym', language: 'pt', value: 'Academia', category: 'amenity' },
  { key: 'amenity_gym', language: 'es', value: 'Gimnasio', category: 'amenity' },
  
  { key: 'amenity_parking', language: 'en', value: 'Free Parking', category: 'amenity' },
  { key: 'amenity_parking', language: 'pt', value: 'Estacionamento Gratuito', category: 'amenity' },
  { key: 'amenity_parking', language: 'es', value: 'Estacionamiento Gratuito', category: 'amenity' },
  
  { key: 'amenity_spa', language: 'en', value: 'Spa & Wellness', category: 'amenity' },
  { key: 'amenity_spa', language: 'pt', value: 'Spa & Bem-estar', category: 'amenity' },
  { key: 'amenity_spa', language: 'es', value: 'Spa y Bienestar', category: 'amenity' },
  
  { key: 'amenity_restaurant', language: 'en', value: 'On-site Restaurant', category: 'amenity' },
  { key: 'amenity_restaurant', language: 'pt', value: 'Restaurante no Local', category: 'amenity' },
  { key: 'amenity_restaurant', language: 'es', value: 'Restaurante en el Lugar', category: 'amenity' },
  
  { key: 'amenity_beach_access', language: 'en', value: 'Beach Access', category: 'amenity' },
  { key: 'amenity_beach_access', language: 'pt', value: 'Acesso à Praia', category: 'amenity' },
  { key: 'amenity_beach_access', language: 'es', value: 'Acceso a la Playa', category: 'amenity' },
  
  { key: 'amenity_concierge', language: 'en', value: '24/7 Concierge', category: 'amenity' },
  { key: 'amenity_concierge', language: 'pt', value: 'Concierge 24/7', category: 'amenity' },
  { key: 'amenity_concierge', language: 'es', value: 'Conserje 24/7', category: 'amenity' },
  
  // Businesses
  { key: 'business_ocean_grill', language: 'en', value: 'Ocean Grill Restaurant', category: 'business' },
  { key: 'business_ocean_grill', language: 'pt', value: 'Restaurante Ocean Grill', category: 'business' },
  { key: 'business_ocean_grill', language: 'es', value: 'Restaurante Ocean Grill', category: 'business' },
  
  { key: 'business_ocean_grill_desc', language: 'en', value: 'Fresh seafood and steaks with ocean views', category: 'business' },
  { key: 'business_ocean_grill_desc', language: 'pt', value: 'Frutos do mar frescos e carnes com vista para o oceano', category: 'business' },
  { key: 'business_ocean_grill_desc', language: 'es', value: 'Mariscos frescos y carnes con vistas al océano', category: 'business' },
  
  { key: 'business_spa_paradise', language: 'en', value: 'Paradise Spa', category: 'business' },
  { key: 'business_spa_paradise', language: 'pt', value: 'Spa Paradise', category: 'business' },
  { key: 'business_spa_paradise', language: 'es', value: 'Spa Paradise', category: 'business' },
  
  { key: 'business_spa_paradise_desc', language: 'en', value: 'Luxury spa treatments and wellness services', category: 'business' },
  { key: 'business_spa_paradise_desc', language: 'pt', value: 'Tratamentos de spa de luxo e serviços de bem-estar', category: 'business' },
  { key: 'business_spa_paradise_desc', language: 'es', value: 'Tratamientos de spa de lujo y servicios de bienestar', category: 'business' },
];

for (const trans of translations) {
  await db.insert(schema.translations).values(trans);
}

// 2. Countries
console.log('Seeding countries...');
const [usaResult] = await db.insert(schema.countries).values({ code: 'USA', nameKey: 'country_usa' });
const [braResult] = await db.insert(schema.countries).values({ code: 'BRA', nameKey: 'country_bra' });
const [fraResult] = await db.insert(schema.countries).values({ code: 'FRA', nameKey: 'country_fra' });

const usaId = usaResult.insertId;
const braId = braResult.insertId;
const fraId = fraResult.insertId;

// 3. States
console.log('Seeding states...');
const [floridaResult] = await db.insert(schema.states).values({ countryId: usaId, code: 'FL', nameKey: 'state_florida' });
const [californiaResult] = await db.insert(schema.states).values({ countryId: usaId, code: 'CA', nameKey: 'state_california' });
const [rioResult] = await db.insert(schema.states).values({ countryId: braId, code: 'RJ', nameKey: 'state_rio' });
const [provenceResult] = await db.insert(schema.states).values({ countryId: fraId, code: 'PAC', nameKey: 'state_provence' });

const floridaId = floridaResult.insertId;
const californiaId = californiaResult.insertId;
const rioId = rioResult.insertId;
const provenceId = provenceResult.insertId;

// 4. Cities
console.log('Seeding cities...');
const [miamiResult] = await db.insert(schema.cities).values({
  stateId: floridaId,
  nameKey: 'city_miami',
  slug: 'miami',
  latitude: '25.7616798',
  longitude: '-80.1917902',
});

const [laResult] = await db.insert(schema.cities).values({
  stateId: californiaId,
  nameKey: 'city_los_angeles',
  slug: 'los-angeles',
  latitude: '34.0522342',
  longitude: '-118.2436849',
});

const [rioCityResult] = await db.insert(schema.cities).values({
  stateId: rioId,
  nameKey: 'city_rio',
  slug: 'rio-de-janeiro',
  latitude: '-22.9068467',
  longitude: '-43.1728965',
});

const [niceResult] = await db.insert(schema.cities).values({
  stateId: provenceId,
  nameKey: 'city_nice',
  slug: 'nice',
  latitude: '43.7101728',
  longitude: '7.2619532',
});

const miamiId = miamiResult.insertId;
const laId = laResult.insertId;
const rioCityId = rioCityResult.insertId;
const niceId = niceResult.insertId;

// 5. Amenities
console.log('Seeding amenities...');
const [poolResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_pool', icon: 'pool', category: 'pool' });
const [wifiResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_wifi', icon: 'wifi', category: 'wifi' });
const [gymResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_gym', icon: 'dumbbell', category: 'gym' });
const [parkingResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_parking', icon: 'car', category: 'parking' });
const [spaResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_spa', icon: 'spa', category: 'spa' });
const [restaurantResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_restaurant', icon: 'utensils', category: 'restaurant' });
const [beachResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_beach_access', icon: 'umbrella-beach', category: 'beach' });
const [conciergeResult] = await db.insert(schema.amenities).values({ nameKey: 'amenity_concierge', icon: 'bell-concierge', category: 'concierge' });

const poolId = poolResult.insertId;
const wifiId = wifiResult.insertId;
const gymId = gymResult.insertId;
const parkingId = parkingResult.insertId;
const spaId = spaResult.insertId;
const restaurantId = restaurantResult.insertId;
const beachId = beachResult.insertId;
const conciergeId = conciergeResult.insertId;

// 6. Developments
console.log('Seeding developments...');
const [miamiDevResult] = await db.insert(schema.developments).values({
  cityId: miamiId,
  nameKey: 'dev_miami_beach_resort',
  slug: 'miami-beach-resort',
  shortDescriptionKey: 'dev_miami_beach_resort_short',
  descriptionKey: 'dev_miami_beach_resort_desc',
  address: '1234 Ocean Drive, Miami Beach, FL 33139',
  latitude: '25.7906866',
  longitude: '-80.1300455',
  startingPrice: 35000, // $350/night
  rating: '4.8',
  isActive: true,
});

const [laDevResult] = await db.insert(schema.developments).values({
  cityId: laId,
  nameKey: 'dev_hollywood_hills_villa',
  slug: 'hollywood-hills-villa',
  shortDescriptionKey: 'dev_hollywood_hills_villa_short',
  descriptionKey: 'dev_hollywood_hills_villa_desc',
  address: '9876 Sunset Plaza Drive, Los Angeles, CA 90069',
  latitude: '34.0928092',
  longitude: '-118.3826734',
  startingPrice: 50000, // $500/night
  rating: '4.9',
  isActive: true,
});

const [rioDevResult] = await db.insert(schema.developments).values({
  cityId: rioCityId,
  nameKey: 'dev_copacabana_penthouse',
  slug: 'copacabana-penthouse',
  shortDescriptionKey: 'dev_copacabana_penthouse_short',
  descriptionKey: 'dev_copacabana_penthouse_desc',
  address: 'Av. Atlântica, 1500, Copacabana, Rio de Janeiro',
  latitude: '-22.9711008',
  longitude: '-43.1822995',
  startingPrice: 28000, // $280/night
  rating: '4.7',
  isActive: true,
});

const [niceDevResult] = await db.insert(schema.developments).values({
  cityId: niceId,
  nameKey: 'dev_french_riviera_chateau',
  slug: 'french-riviera-chateau',
  shortDescriptionKey: 'dev_french_riviera_chateau_short',
  descriptionKey: 'dev_french_riviera_chateau_desc',
  address: 'Route de la Corniche, 06000 Nice, France',
  latitude: '43.6950000',
  longitude: '7.2710000',
  startingPrice: 60000, // $600/night
  rating: '5.0',
  isActive: true,
});

const miamiDevId = miamiDevResult.insertId;
const laDevId = laDevResult.insertId;
const rioDevId = rioDevResult.insertId;
const niceDevId = niceDevResult.insertId;

// 7. Development Amenities
console.log('Linking amenities to developments...');
// Miami Beach Resort
await db.insert(schema.developmentAmenities).values([
  { developmentId: miamiDevId, amenityId: poolId },
  { developmentId: miamiDevId, amenityId: wifiId },
  { developmentId: miamiDevId, amenityId: gymId },
  { developmentId: miamiDevId, amenityId: spaId },
  { developmentId: miamiDevId, amenityId: restaurantId },
  { developmentId: miamiDevId, amenityId: beachId },
  { developmentId: miamiDevId, amenityId: conciergeId },
]);

// Hollywood Hills Villa
await db.insert(schema.developmentAmenities).values([
  { developmentId: laDevId, amenityId: poolId },
  { developmentId: laDevId, amenityId: wifiId },
  { developmentId: laDevId, amenityId: parkingId },
  { developmentId: laDevId, amenityId: conciergeId },
]);

// Copacabana Penthouse
await db.insert(schema.developmentAmenities).values([
  { developmentId: rioDevId, amenityId: poolId },
  { developmentId: rioDevId, amenityId: wifiId },
  { developmentId: rioDevId, amenityId: gymId },
  { developmentId: rioDevId, amenityId: parkingId },
  { developmentId: rioDevId, amenityId: beachId },
  { developmentId: rioDevId, amenityId: conciergeId },
]);

// French Riviera Château
await db.insert(schema.developmentAmenities).values([
  { developmentId: niceDevId, amenityId: poolId },
  { developmentId: niceDevId, amenityId: wifiId },
  { developmentId: niceDevId, amenityId: parkingId },
  { developmentId: niceDevId, amenityId: spaId },
  { developmentId: niceDevId, amenityId: restaurantId },
  { developmentId: niceDevId, amenityId: conciergeId },
]);

// 8. Sponsored Businesses
console.log('Seeding sponsored businesses...');
const [oceanGrillResult] = await db.insert(schema.sponsoredBusinesses).values({
  nameKey: 'business_ocean_grill',
  descriptionKey: 'business_ocean_grill_desc',
  category: 'restaurant',
  websiteUrl: 'https://oceangrill.example.com',
  phoneNumber: '+1 (305) 555-0123',
  address: '1200 Ocean Drive, Miami Beach, FL',
  latitude: '25.7900000',
  longitude: '-80.1300000',
  isActive: true,
});

const [spaParadiseResult] = await db.insert(schema.sponsoredBusinesses).values({
  nameKey: 'business_spa_paradise',
  descriptionKey: 'business_spa_paradise_desc',
  category: 'spa',
  websiteUrl: 'https://spaparadise.example.com',
  phoneNumber: '+1 (305) 555-0456',
  address: '1250 Ocean Drive, Miami Beach, FL',
  latitude: '25.7910000',
  longitude: '-80.1310000',
  isActive: true,
});

const oceanGrillId = oceanGrillResult.insertId;
const spaParadiseId = spaParadiseResult.insertId;

// 9. Link businesses to developments and cities
console.log('Linking businesses to developments and cities...');
await db.insert(schema.businessDevelopments).values([
  { businessId: oceanGrillId, developmentId: miamiDevId, order: 1 },
  { businessId: spaParadiseId, developmentId: miamiDevId, order: 2 },
]);

await db.insert(schema.businessCities).values([
  { businessId: oceanGrillId, cityId: miamiId },
  { businessId: spaParadiseId, cityId: miamiId },
]);

console.log('✅ Database seeding completed successfully!');
console.log('');
console.log('Summary:');
console.log('- 4 Countries');
console.log('- 4 States');
console.log('- 4 Cities (Miami, Los Angeles, Rio de Janeiro, Nice)');
console.log('- 4 Developments');
console.log('- 8 Amenities');
console.log('- 2 Sponsored Businesses');
console.log('- Multiple translations in 6 languages');

await connection.end();
