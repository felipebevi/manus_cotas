import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://test.example.com",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("Payment Integration", () => {
  it("should have payment router with createCheckoutSession mutation", () => {
    const caller = appRouter.createCaller(createAuthContext());
    
    expect(caller.payment).toBeDefined();
    expect(caller.payment.createCheckoutSession).toBeDefined();
  });

  it("should have payment router with createPaymentIntent mutation", () => {
    const caller = appRouter.createCaller(createAuthContext());
    
    expect(caller.payment).toBeDefined();
    expect(caller.payment.createPaymentIntent).toBeDefined();
  });

  it("should require authentication for payment endpoints", async () => {
    const unauthenticatedCtx: TrpcContext = {
      user: undefined,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(unauthenticatedCtx);

    await expect(
      caller.payment.createCheckoutSession({
        reservationId: 1,
        developmentId: 1,
      })
    ).rejects.toThrow();
  });
});
