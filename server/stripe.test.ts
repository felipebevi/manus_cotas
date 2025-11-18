import { describe, expect, it } from "vitest";
import { stripe } from "./stripe";

describe("Stripe Integration", () => {
  it("should successfully connect to Stripe API with provided credentials", async () => {
    // Test by retrieving account information
    const account = await stripe.accounts.retrieve();
    
    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(typeof account.id).toBe("string");
  });

  it("should be able to create a payment intent", async () => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: "usd",
      metadata: {
        test: "true",
      },
    });

    expect(paymentIntent).toBeDefined();
    expect(paymentIntent.id).toBeDefined();
    expect(paymentIntent.amount).toBe(1000);
    expect(paymentIntent.currency).toBe("usd");
    expect(paymentIntent.status).toBeDefined();
  });
});
