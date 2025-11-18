import Stripe from 'stripe';
import { ENV } from './_core/env';

if (!ENV.stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

export async function createCheckoutSession(params: {
  amount: number; // in cents
  currency: string;
  userId: number;
  userEmail: string;
  userName: string;
  reservationId: number;
  developmentName: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: params.currency,
          product_data: {
            name: params.developmentName,
            description: 'Vacation rental reservation',
          },
          unit_amount: params.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
      reservation_id: params.reservationId.toString(),
    },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createPaymentIntent(params: {
  amount: number; // in cents
  currency: string;
  userId: number;
  userEmail: string;
  reservationId: number;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency,
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      reservation_id: params.reservationId.toString(),
    },
  });

  return paymentIntent;
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function retrieveCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}
