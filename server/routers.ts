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
