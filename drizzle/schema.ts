import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, unique, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "cotista"]).default("user").notNull(),
  status: mysqlEnum("status", ["registered", "verified", "under_review", "rejected", "suspended"]).default("registered").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * i18n translations table - stores all multilingual content
 */
export const translations = mysqlTable("translations", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull(),
  language: mysqlEnum("language", ["pt", "en", "es", "fr", "it", "ja"]).notNull(),
  value: text("value").notNull(),
  category: varchar("category", { length: 100 }), // ui, email, notification, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueKeyLang: unique().on(table.key, table.language),
  keyIdx: index("key_idx").on(table.key),
}));

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;

/**
 * Countries table
 */
export const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(), // ISO 3166-1 alpha-3
  nameKey: varchar("nameKey", { length: 255 }).notNull(), // i18n key
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Country = typeof countries.$inferSelect;
export type InsertCountry = typeof countries.$inferInsert;

/**
 * States/Provinces table
 */
export const states = mysqlTable("states", {
  id: int("id").autoincrement().primaryKey(),
  countryId: int("countryId").notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  nameKey: varchar("nameKey", { length: 255 }).notNull(), // i18n key
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  countryIdx: index("country_idx").on(table.countryId),
}));

export type State = typeof states.$inferSelect;
export type InsertState = typeof states.$inferInsert;

/**
 * Cities table
 */
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  stateId: int("stateId").notNull(),
  nameKey: varchar("nameKey", { length: 255 }).notNull(), // i18n key
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  stateIdx: index("state_idx").on(table.stateId),
  coordIdx: index("coord_idx").on(table.latitude, table.longitude),
}));

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

/**
 * Developments (vacation properties)
 */
export const developments = mysqlTable("developments", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  nameKey: varchar("nameKey", { length: 255 }).notNull(), // i18n key
  descriptionKey: varchar("descriptionKey", { length: 255 }).notNull(), // i18n key
  shortDescriptionKey: varchar("shortDescriptionKey", { length: 255 }).notNull(), // i18n key
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  startingPrice: int("startingPrice").notNull(), // in cents
  rulesKey: varchar("rulesKey", { length: 255 }), // i18n key for rules
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  cityIdx: index("city_idx").on(table.cityId),
  activeIdx: index("active_idx").on(table.isActive),
}));

export type Development = typeof developments.$inferSelect;
export type InsertDevelopment = typeof developments.$inferInsert;

/**
 * Development photos
 */
export const developmentPhotos = mysqlTable("development_photos", {
  id: int("id").autoincrement().primaryKey(),
  developmentId: int("developmentId").notNull(),
  url: text("url").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  devIdx: index("dev_idx").on(table.developmentId),
}));

export type DevelopmentPhoto = typeof developmentPhotos.$inferSelect;
export type InsertDevelopmentPhoto = typeof developmentPhotos.$inferInsert;

/**
 * Amenities
 */
export const amenities = mysqlTable("amenities", {
  id: int("id").autoincrement().primaryKey(),
  nameKey: varchar("nameKey", { length: 255 }).notNull().unique(), // i18n key
  icon: varchar("icon", { length: 100 }), // icon name or class
  category: varchar("category", { length: 100 }), // pool, wifi, gym, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = typeof amenities.$inferInsert;

/**
 * Development amenities junction table
 */
export const developmentAmenities = mysqlTable("development_amenities", {
  id: int("id").autoincrement().primaryKey(),
  developmentId: int("developmentId").notNull(),
  amenityId: int("amenityId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  devIdx: index("dev_idx").on(table.developmentId),
  amenityIdx: index("amenity_idx").on(table.amenityId),
  uniqueDevAmenity: unique().on(table.developmentId, table.amenityId),
}));

export type DevelopmentAmenity = typeof developmentAmenities.$inferSelect;
export type InsertDevelopmentAmenity = typeof developmentAmenities.$inferInsert;

/**
 * Sponsored businesses (restaurants, tours, etc.)
 */
export const sponsoredBusinesses = mysqlTable("sponsored_businesses", {
  id: int("id").autoincrement().primaryKey(),
  nameKey: varchar("nameKey", { length: 255 }).notNull(), // i18n key
  descriptionKey: varchar("descriptionKey", { length: 255 }).notNull(), // i18n key
  category: varchar("category", { length: 100 }).notNull(), // restaurant, tour, spa, etc.
  photoUrl: text("photoUrl"),
  photoFileKey: varchar("photoFileKey", { length: 500 }),
  websiteUrl: text("websiteUrl"),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SponsoredBusiness = typeof sponsoredBusinesses.$inferSelect;
export type InsertSponsoredBusiness = typeof sponsoredBusinesses.$inferInsert;

/**
 * Business-Development association (which businesses show on which developments)
 */
export const businessDevelopments = mysqlTable("business_developments", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").notNull(),
  developmentId: int("developmentId").notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  businessIdx: index("business_idx").on(table.businessId),
  devIdx: index("dev_idx").on(table.developmentId),
  uniqueBusinessDev: unique().on(table.businessId, table.developmentId),
}));

export type BusinessDevelopment = typeof businessDevelopments.$inferSelect;
export type InsertBusinessDevelopment = typeof businessDevelopments.$inferInsert;

/**
 * Business-City association (which businesses show on which cities)
 */
export const businessCities = mysqlTable("business_cities", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").notNull(),
  cityId: int("cityId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  businessIdx: index("business_idx").on(table.businessId),
  cityIdx: index("city_idx").on(table.cityId),
  uniqueBusinessCity: unique().on(table.businessId, table.cityId),
}));

export type BusinessCity = typeof businessCities.$inferSelect;
export type InsertBusinessCity = typeof businessCities.$inferInsert;

/**
 * Cotista (fractional owner) profiles
 */
export const cotistas = mysqlTable("cotistas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  developmentId: int("developmentId").notNull(),
  personalData: text("personalData"), // JSON with personal info
  ownershipProof: text("ownershipProof"), // file URLs
  bankDetails: text("bankDetails"), // encrypted or JSON
  addressProof: text("addressProof"), // file URLs
  identityDocuments: text("identityDocuments"), // file URLs
  termsAccepted: boolean("termsAccepted").default(false).notNull(),
  termsAcceptedAt: timestamp("termsAcceptedAt"),
  status: mysqlEnum("status", ["registered", "under_review", "approved", "rejected", "suspended"]).default("registered").notNull(),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  devIdx: index("dev_idx").on(table.developmentId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Cotista = typeof cotistas.$inferSelect;
export type InsertCotista = typeof cotistas.$inferInsert;

/**
 * Cotista availability slots
 */
export const cotistaAvailability = mysqlTable("cotista_availability", {
  id: int("id").autoincrement().primaryKey(),
  cotistaId: int("cotistaId").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  pricePerNight: int("pricePerNight").notNull(), // in cents
  isPublished: boolean("isPublished").default(false).notNull(),
  isBooked: boolean("isBooked").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  cotistaIdx: index("cotista_idx").on(table.cotistaId),
  dateIdx: index("date_idx").on(table.startDate, table.endDate),
  publishedIdx: index("published_idx").on(table.isPublished),
}));

export type CotistaAvailability = typeof cotistaAvailability.$inferSelect;
export type InsertCotistaAvailability = typeof cotistaAvailability.$inferInsert;

/**
 * Reservations
 */
export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  developmentId: int("developmentId").notNull(),
  cotistaId: int("cotistaId").notNull(),
  availabilityId: int("availabilityId").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  totalPrice: int("totalPrice").notNull(), // in cents
  status: mysqlEnum("status", [
    "created",
    "awaiting_payment",
    "payment_pending",
    "paid",
    "documents_pending",
    "documents_under_review",
    "documents_rejected",
    "approved",
    "voucher_pending",
    "voucher_sent",
    "voucher_under_review",
    "voucher_rejected",
    "voucher_delivered",
    "completed",
    "refunded",
    "cancelled",
    "in_dispute"
  ]).default("created").notNull(),
  paymentIntentId: varchar("paymentIntentId", { length: 255 }), // external payment ID
  cancellationReason: text("cancellationReason"),
  refundAmount: int("refundAmount"), // in cents
  refundedAt: timestamp("refundedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  customerIdx: index("customer_idx").on(table.customerId),
  devIdx: index("dev_idx").on(table.developmentId),
  cotistaIdx: index("cotista_idx").on(table.cotistaId),
  statusIdx: index("status_idx").on(table.status),
  dateIdx: index("date_idx").on(table.startDate, table.endDate),
}));

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

/**
 * Customer documents
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  reservationId: int("reservationId").notNull(),
  customerId: int("customerId").notNull(),
  documentType: mysqlEnum("documentType", ["id", "address_proof", "other"]).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["pending", "under_review", "approved", "rejected"]).default("pending").notNull(),
  rejectionReason: text("rejectionReason"),
  reviewedBy: int("reviewedBy"), // admin user ID
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  reservationIdx: index("reservation_idx").on(table.reservationId),
  customerIdx: index("customer_idx").on(table.customerId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Vouchers
 */
export const vouchers = mysqlTable("vouchers", {
  id: int("id").autoincrement().primaryKey(),
  reservationId: int("reservationId").notNull().unique(),
  cotistaId: int("cotistaId").notNull(),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 500 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "sent", "under_review", "approved", "rejected", "delivered"]).default("pending").notNull(),
  rejectionReason: text("rejectionReason"),
  reviewedBy: int("reviewedBy"), // admin user ID
  reviewedAt: timestamp("reviewedAt"),
  deliveredAt: timestamp("deliveredAt"),
  deadline: timestamp("deadline"), // countdown for cotista to upload
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  reservationIdx: index("reservation_idx").on(table.reservationId),
  cotistaIdx: index("cotista_idx").on(table.cotistaId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Voucher = typeof vouchers.$inferSelect;
export type InsertVoucher = typeof vouchers.$inferInsert;

/**
 * Payments
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  reservationId: int("reservationId").notNull(),
  customerId: int("customerId").notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  externalPaymentId: varchar("externalPaymentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "refunded"]).default("pending").notNull(),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  reservationIdx: index("reservation_idx").on(table.reservationId),
  customerIdx: index("customer_idx").on(table.customerId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Disputes
 */
export const disputes = mysqlTable("disputes", {
  id: int("id").autoincrement().primaryKey(),
  reservationId: int("reservationId").notNull(),
  reportedBy: int("reportedBy").notNull(), // user ID
  reportedAgainst: int("reportedAgainst"), // user ID (optional)
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["open", "under_review", "resolved", "closed", "escalated"]).default("open").notNull(),
  resolution: text("resolution"),
  resolvedBy: int("resolvedBy"), // admin user ID
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  reservationIdx: index("reservation_idx").on(table.reservationId),
  reportedByIdx: index("reported_by_idx").on(table.reportedBy),
  statusIdx: index("status_idx").on(table.status),
}));

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Audit trail / notes
 */
export const auditNotes = mysqlTable("audit_notes", {
  id: int("id").autoincrement().primaryKey(),
  entityType: mysqlEnum("entityType", ["user", "cotista", "reservation", "document", "voucher", "dispute"]).notNull(),
  entityId: int("entityId").notNull(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(), // approved, rejected, flagged, etc.
  notes: text("notes"),
  metadata: text("metadata"), // JSON for additional context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  entityIdx: index("entity_idx").on(table.entityType, table.entityId),
  adminIdx: index("admin_idx").on(table.adminId),
}));

export type AuditNote = typeof auditNotes.$inferSelect;
export type InsertAuditNote = typeof auditNotes.$inferInsert;

/**
 * Fraud flags
 */
export const fraudFlags = mysqlTable("fraud_flags", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reservationId: int("reservationId"),
  flagType: varchar("flagType", { length: 100 }).notNull(), // duplicate_booking, chargeback, suspicious_document, etc.
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["open", "investigating", "resolved", "false_positive"]).default("open").notNull(),
  resolvedBy: int("resolvedBy"), // admin user ID
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  reservationIdx: index("reservation_idx").on(table.reservationId),
  statusIdx: index("status_idx").on(table.status),
  severityIdx: index("severity_idx").on(table.severity),
}));

export type FraudFlag = typeof fraudFlags.$inferSelect;
export type InsertFraudFlag = typeof fraudFlags.$inferInsert;
