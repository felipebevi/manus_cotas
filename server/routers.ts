import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to check if user is admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Helper to check if user is cotista
const cotistaProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const cotista = await db.getCotistaByUserId(ctx.user.id);
  if (!cotista) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Cotista access required' });
  }
  return next({ ctx: { ...ctx, cotista } });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // i18n router
  i18n: router({
    getTranslations: publicProcedure
      .input(z.object({
        language: z.enum(['pt', 'en', 'es', 'fr', 'it', 'ja']),
        keys: z.array(z.string()).optional(),
      }))
      .query(async ({ input }) => {
        const translations = await db.getTranslations(input.language, input.keys);
        return translations.reduce((acc, t) => {
          acc[t.key] = t.value;
          return acc;
        }, {} as Record<string, string>);
      }),

    getTranslationsByCategory: publicProcedure
      .input(z.object({
        language: z.enum(['pt', 'en', 'es', 'fr', 'it', 'ja']),
        category: z.string(),
      }))
      .query(async ({ input }) => {
        const translations = await db.getTranslationsByCategory(input.language, input.category);
        return translations.reduce((acc, t) => {
          acc[t.key] = t.value;
          return acc;
        }, {} as Record<string, string>);
      }),
  }),

  // Geography router
  geography: router({
    getCountries: publicProcedure.query(async () => {
      return await db.getAllCountries();
    }),

    getStates: publicProcedure
      .input(z.object({ countryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStatesByCountry(input.countryId);
      }),

    getCities: publicProcedure
      .input(z.object({ stateId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCitiesByState(input.stateId);
      }),

    getCityBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const city = await db.getCityBySlug(input.slug);
        if (!city) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'City not found' });
        }
        return city;
      }),
  }),

  // Developments router
  developments: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllDevelopmentsWithLocation();
    }),

    getByCity: publicProcedure
      .input(z.object({ cityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDevelopmentsByCity(input.cityId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const development = await db.getDevelopmentById(input.id);
        if (!development) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Development not found' });
        }

        const [photos, amenities, businesses] = await Promise.all([
          db.getDevelopmentPhotos(input.id),
          db.getDevelopmentAmenities(input.id),
          db.getSponsoredBusinessesByDevelopment(input.id),
        ]);

        return {
          development,
          photos,
          amenities,
          businesses,
        };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const development = await db.getDevelopmentBySlug(input.slug);
        if (!development) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Development not found' });
        }

        const [photos, amenities, businesses] = await Promise.all([
          db.getDevelopmentPhotos(development.id),
          db.getDevelopmentAmenities(development.id),
          db.getSponsoredBusinessesByDevelopment(development.id),
        ]);

        return {
          development,
          photos,
          amenities,
          businesses,
        };
      }),

    getAvailability: publicProcedure
      .input(z.object({
        developmentId: z.number(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getCotistaAvailabilityByDevelopment(
          input.developmentId,
          input.startDate,
          input.endDate
        );
      }),
  }),

  // Reservations router (customer side)
  reservations: router({
    getMyReservations: protectedProcedure.query(async ({ ctx }) => {
      return await db.getReservationsByCustomer(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const reservation = await db.getReservationById(input.id);
        if (!reservation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Reservation not found' });
        }

        // Check if user owns this reservation
        if (reservation.customerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        const [documents, voucher, payments] = await Promise.all([
          db.getDocumentsByReservation(input.id),
          db.getVoucherByReservation(input.id),
          db.getPaymentsByReservation(input.id),
        ]);

        return {
          reservation,
          documents,
          voucher,
          payments,
        };
      }),
  }),

  // Cotista router
  cotista: router({
    getProfile: cotistaProcedure.query(async ({ ctx }) => {
      return ctx.cotista;
    }),

    getMyReservations: cotistaProcedure.query(async ({ ctx }) => {
      return await db.getReservationsByCotista(ctx.cotista.id);
    }),

    getDashboard: cotistaProcedure.query(async ({ ctx }) => {
      const reservations = await db.getReservationsByCotista(ctx.cotista.id);
      
      const pendingVouchers = reservations.filter(r => 
        r.status === 'voucher_pending' || r.status === 'approved'
      );

      return {
        totalReservations: reservations.length,
        pendingVouchers: pendingVouchers.length,
        activeReservations: reservations.filter(r => 
          r.status !== 'completed' && r.status !== 'cancelled' && r.status !== 'refunded'
        ).length,
      };
    }),
  }),

  // Payment router
  payment: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        reservationId: z.number(),
        developmentId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import('./stripe');
        
        // Get reservation details
        const reservation = await db.getReservationById(input.reservationId);
        if (!reservation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Reservation not found' });
        }

        // Verify user owns this reservation
        if (reservation.customerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        // Get development details
        const development = await db.getDevelopmentById(input.developmentId);
        if (!development) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Development not found' });
        }

        const origin = ctx.req.headers.origin || 'http://localhost:3000';

        const session = await createCheckoutSession({
          amount: reservation.totalPrice,
          currency: 'usd',
          userId: ctx.user.id,
          userEmail: ctx.user.email || '',
          userName: ctx.user.name || '',
          reservationId: reservation.id,
          developmentName: development.nameKey,
          successUrl: `${origin}/reservation/${reservation.id}/success`,
          cancelUrl: `${origin}/reservation/${reservation.id}/payment`,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      }),

    createPaymentIntent: protectedProcedure
      .input(z.object({
        reservationId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createPaymentIntent } = await import('./stripe');
        
        const reservation = await db.getReservationById(input.reservationId);
        if (!reservation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Reservation not found' });
        }

        if (reservation.customerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        const paymentIntent = await createPaymentIntent({
          amount: reservation.totalPrice,
          currency: 'usd',
          userId: ctx.user.id,
          userEmail: ctx.user.email || '',
          reservationId: reservation.id,
        });

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };
      }),
  }),

  // Documents router
  documents: router({
    uploadCustomerDocument: protectedProcedure
      .input(z.object({
        reservationId: z.number(),
        documentType: z.enum(['id', 'address_proof', 'other']),
        fileData: z.string(), // base64 encoded
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { uploadFile, validateFile, DOCUMENT_TYPES, MAX_DOCUMENT_SIZE_MB } = await import('./upload');
        const { getDb } = await import('./db');
        const { documents } = await import('../drizzle/schema');
        
        // Verify reservation exists and belongs to user
        const reservation = await db.getReservationById(input.reservationId);
        if (!reservation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Reservation not found' });
        }
        if (reservation.customerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        // Decode base64 file
        const fileBuffer = Buffer.from(input.fileData, 'base64');
        
        // Validate file
        const validation = validateFile(
          input.contentType,
          fileBuffer.length,
          DOCUMENT_TYPES,
          MAX_DOCUMENT_SIZE_MB
        );
        
        if (!validation.valid) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: validation.error });
        }

        // Upload to S3
        const uploadResult = await uploadFile(
          fileBuffer,
          ctx.user.id,
          'customer-documents',
          input.fileName,
          input.contentType
        );

        // Save to database
        const dbInstance = await getDb();
        if (!dbInstance) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        }

        await dbInstance.insert(documents).values({
          reservationId: input.reservationId,
          customerId: ctx.user.id,
          documentType: input.documentType,
          fileUrl: uploadResult.fileUrl,
          fileKey: uploadResult.fileKey,
          status: 'under_review',
        });

        return {
          success: true,
          fileUrl: uploadResult.fileUrl,
        };
      }),

    uploadCotistaDocument: protectedProcedure
      .input(z.object({
        documentType: z.enum(['identity', 'address_proof', 'ownership_proof']),
        fileData: z.string(), // base64 encoded
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { uploadFile, validateFile, DOCUMENT_TYPES, MAX_DOCUMENT_SIZE_MB } = await import('./upload');
        
        // Decode base64 file
        const fileBuffer = Buffer.from(input.fileData, 'base64');
        
        // Validate file
        const validation = validateFile(
          input.contentType,
          fileBuffer.length,
          DOCUMENT_TYPES,
          MAX_DOCUMENT_SIZE_MB
        );
        
        if (!validation.valid) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: validation.error });
        }

        // Upload to S3
        const uploadResult = await uploadFile(
          fileBuffer,
          ctx.user.id,
          'cotista-documents',
          input.fileName,
          input.contentType
        );

        return {
          success: true,
          fileUrl: uploadResult.fileUrl,
          fileKey: uploadResult.fileKey,
          documentType: input.documentType,
        };
      }),

    getMyDocuments: protectedProcedure
      .input(z.object({ reservationId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getDocumentsByReservation(input.reservationId);
      }),
  }),

  // Admin router
  admin: router({
    getDashboard: adminProcedure.query(async () => {
      const [
        pendingDocuments,
        pendingCotistas,
        pendingVouchers,
        openDisputes,
        fraudFlags,
      ] = await Promise.all([
        db.getPendingCustomerDocuments(),
        db.getPendingCotistas(),
        db.getPendingVouchers(),
        db.getOpenDisputes(),
        db.getActiveFraudFlags(),
      ]);

      return {
        pendingDocuments: pendingDocuments.length,
        pendingCotistas: pendingCotistas.length,
        pendingVouchers: pendingVouchers.length,
        openDisputes: openDisputes.length,
        fraudFlags: fraudFlags.length,
      };
    }),

    getPendingDocuments: adminProcedure.query(async () => {
      return await db.getPendingCustomerDocuments();
    }),

    getPendingCotistas: adminProcedure.query(async () => {
      return await db.getPendingCotistas();
    }),

    getPendingVouchers: adminProcedure.query(async () => {
      return await db.getPendingVouchers();
    }),

    getOpenDisputes: adminProcedure.query(async () => {
      return await db.getOpenDisputes();
    }),

    getFraudFlags: adminProcedure.query(async () => {
      return await db.getActiveFraudFlags();
    }),
  }),
});

export type AppRouter = typeof appRouter;
