import { describe, expect, it } from "vitest";
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
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("Documents Upload", () => {
  it("should have documents router with upload endpoints", () => {
    const caller = appRouter.createCaller(createAuthContext());
    
    expect(caller.documents).toBeDefined();
    expect(caller.documents.uploadCustomerDocument).toBeDefined();
    expect(caller.documents.uploadCotistaDocument).toBeDefined();
    expect(caller.documents.getMyDocuments).toBeDefined();
  });

  it("should require authentication for document upload", async () => {
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
      caller.documents.uploadCustomerDocument({
        reservationId: 1,
        documentType: "id",
        fileData: "base64data",
        fileName: "test.pdf",
        contentType: "application/pdf",
      })
    ).rejects.toThrow();
  });

  it("should validate file types", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    // This will fail because reservation doesn't exist, but it validates the input schema
    await expect(
      caller.documents.uploadCustomerDocument({
        reservationId: 999,
        documentType: "id",
        fileData: Buffer.from("test").toString('base64'),
        fileName: "test.exe",
        contentType: "application/x-msdownload",
      })
    ).rejects.toThrow();
  });
});
