import { eq, and, or, inArray, gte, lte, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  translations, InsertTranslation,
  countries, states, cities,
  developments, developmentPhotos, developmentAmenities, amenities,
  sponsoredBusinesses, businessDevelopments, businessCities,
  cotistas, cotistaAvailability,
  reservations, documents, vouchers, payments, disputes,
  auditNotes, fraudFlags
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ i18n Helpers ============

export async function getTranslations(language: "pt" | "en" | "es" | "fr" | "it" | "ja", keys?: string[]) {
  const db = await getDb();
  if (!db) return [];

  if (keys && keys.length > 0) {
    return await db.select().from(translations)
      .where(and(
        eq(translations.language, language),
        inArray(translations.key, keys)
      ));
  }

  return await db.select().from(translations)
    .where(eq(translations.language, language));
}

export async function getTranslationsByCategory(language: "pt" | "en" | "es" | "fr" | "it" | "ja", category: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(translations)
    .where(and(
      eq(translations.language, language),
      eq(translations.category, category)
    ));
}

export async function upsertTranslation(translation: InsertTranslation) {
  const db = await getDb();
  if (!db) return;

  await db.insert(translations)
    .values(translation)
    .onDuplicateKeyUpdate({
      set: { value: translation.value, updatedAt: new Date() }
    });
}

export async function bulkUpsertTranslations(translationList: InsertTranslation[]) {
  const db = await getDb();
  if (!db) return;

  for (const translation of translationList) {
    await upsertTranslation(translation);
  }
}

// ============ Geography Helpers ============

export async function getAllCountries() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(countries);
}

export async function getStatesByCountry(countryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(states).where(eq(states.countryId, countryId));
}

export async function getCitiesByState(stateId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cities).where(eq(cities.stateId, stateId));
}

export async function getCityById(cityId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cities).where(eq(cities.id, cityId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCityBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cities).where(eq(cities.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Development Helpers ============

export async function getDevelopmentsByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(developments)
    .where(and(
      eq(developments.cityId, cityId),
      eq(developments.isActive, true)
    ));
}

export async function getDevelopmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(developments).where(eq(developments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDevelopmentBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(developments).where(eq(developments.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDevelopmentPhotos(developmentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(developmentPhotos)
    .where(eq(developmentPhotos.developmentId, developmentId))
    .orderBy(asc(developmentPhotos.order));
}

export async function getDevelopmentAmenities(developmentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    amenity: amenities
  })
    .from(developmentAmenities)
    .innerJoin(amenities, eq(developmentAmenities.amenityId, amenities.id))
    .where(eq(developmentAmenities.developmentId, developmentId));
  
  return result.map(r => r.amenity);
}

export async function getSponsoredBusinessesByDevelopment(developmentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    business: sponsoredBusinesses
  })
    .from(businessDevelopments)
    .innerJoin(sponsoredBusinesses, eq(businessDevelopments.businessId, sponsoredBusinesses.id))
    .where(and(
      eq(businessDevelopments.developmentId, developmentId),
      eq(sponsoredBusinesses.isActive, true)
    ))
    .orderBy(asc(businessDevelopments.order));
  
  return result.map(r => r.business);
}

export async function getAllDevelopmentsWithLocation() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select({
    development: developments,
    city: cities,
    state: states,
    country: countries
  })
    .from(developments)
    .innerJoin(cities, eq(developments.cityId, cities.id))
    .innerJoin(states, eq(cities.stateId, states.id))
    .innerJoin(countries, eq(states.countryId, countries.id))
    .where(eq(developments.isActive, true));
}

// ============ Cotista Helpers ============

export async function getCotistaByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cotistas).where(eq(cotistas.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCotistaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cotistas).where(eq(cotistas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCotistaAvailabilityByDevelopment(developmentId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [
    eq(cotistas.developmentId, developmentId),
    eq(cotistas.status, "approved"),
    eq(cotistaAvailability.isPublished, true),
    eq(cotistaAvailability.isBooked, false)
  ];
  
  if (startDate && endDate) {
    conditions.push(gte(cotistaAvailability.startDate, startDate));
    conditions.push(lte(cotistaAvailability.endDate, endDate));
  }
  
  return await db.select({
    availability: cotistaAvailability,
    cotista: cotistas
  })
    .from(cotistaAvailability)
    .innerJoin(cotistas, eq(cotistaAvailability.cotistaId, cotistas.id))
    .where(and(...conditions));
}

// ============ Reservation Helpers ============

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getReservationsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reservations)
    .where(eq(reservations.customerId, customerId))
    .orderBy(desc(reservations.createdAt));
}

export async function getReservationsByCotista(cotistaId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reservations)
    .where(eq(reservations.cotistaId, cotistaId))
    .orderBy(desc(reservations.createdAt));
}

export async function getDocumentsByReservation(reservationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents)
    .where(eq(documents.reservationId, reservationId));
}

export async function getVoucherByReservation(reservationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vouchers)
    .where(eq(vouchers.reservationId, reservationId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPaymentsByReservation(reservationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments)
    .where(eq(payments.reservationId, reservationId))
    .orderBy(desc(payments.createdAt));
}

// ============ Admin Helpers ============

export async function getPendingCustomerDocuments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    document: documents,
    reservation: reservations,
    customer: users
  })
    .from(documents)
    .innerJoin(reservations, eq(documents.reservationId, reservations.id))
    .innerJoin(users, eq(documents.customerId, users.id))
    .where(eq(documents.status, "under_review"))
    .orderBy(desc(documents.createdAt));
}

export async function getPendingCotistas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    cotista: cotistas,
    user: users,
    development: developments
  })
    .from(cotistas)
    .innerJoin(users, eq(cotistas.userId, users.id))
    .innerJoin(developments, eq(cotistas.developmentId, developments.id))
    .where(eq(cotistas.status, "under_review"))
    .orderBy(desc(cotistas.createdAt));
}

export async function getPendingVouchers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    voucher: vouchers,
    reservation: reservations,
    cotista: cotistas,
    cotistaUser: users
  })
    .from(vouchers)
    .innerJoin(reservations, eq(vouchers.reservationId, reservations.id))
    .innerJoin(cotistas, eq(vouchers.cotistaId, cotistas.id))
    .innerJoin(users, eq(cotistas.userId, users.id))
    .where(eq(vouchers.status, "under_review"))
    .orderBy(desc(vouchers.createdAt));
}

export async function getOpenDisputes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(disputes)
    .where(inArray(disputes.status, ["open", "under_review", "escalated"]))
    .orderBy(desc(disputes.createdAt));
}

export async function getActiveFraudFlags() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    flag: fraudFlags,
    user: users
  })
    .from(fraudFlags)
    .innerJoin(users, eq(fraudFlags.userId, users.id))
    .where(inArray(fraudFlags.status, ["open", "investigating"]))
    .orderBy(desc(fraudFlags.severity), desc(fraudFlags.createdAt));
}

export async function createAuditNote(note: {
  entityType: "user" | "cotista" | "reservation" | "document" | "voucher" | "dispute";
  entityId: number;
  adminId: number;
  action: string;
  notes?: string;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(auditNotes).values(note);
}
