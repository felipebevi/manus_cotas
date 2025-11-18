import { Request, Response } from 'express';
import { stripe } from './stripe';
import { ENV } from './_core/env';
import { getDb } from './db';
import { reservations, payments } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('[Webhook] No signature found');
    return res.status(400).send('No signature found');
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('[Webhook] Received event:', event.type, event.id);

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ 
      verified: true,
    });
  }

  const db = await getDb();
  if (!db) {
    console.error('[Webhook] Database not available');
    return res.status(500).send('Database not available');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const reservationId = parseInt(session.metadata.reservation_id);
        const paymentIntentId = session.payment_intent;

        console.log('[Webhook] Checkout completed for reservation:', reservationId);

        // Update reservation status
        await db.update(reservations)
          .set({ 
            status: 'paid',
            paymentIntentId: paymentIntentId,
            updatedAt: new Date(),
          })
          .where(eq(reservations.id, reservationId));

        // Create payment record
        await db.insert(payments).values({
          reservationId,
          customerId: parseInt(session.metadata.user_id),
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          externalPaymentId: paymentIntentId,
          status: 'completed',
          paymentMethod: 'card',
        });

        console.log('[Webhook] Payment recorded for reservation:', reservationId);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const reservationId = parseInt(paymentIntent.metadata.reservation_id);

        console.log('[Webhook] Payment intent succeeded for reservation:', reservationId);

        // Update payment status
        await db.update(payments)
          .set({ 
            status: 'completed',
            updatedAt: new Date(),
          })
          .where(eq(payments.externalPaymentId, paymentIntent.id));

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const reservationId = parseInt(paymentIntent.metadata.reservation_id);

        console.log('[Webhook] Payment failed for reservation:', reservationId);

        // Update payment status
        await db.update(payments)
          .set({ 
            status: 'failed',
            failureReason: paymentIntent.last_payment_error?.message,
            updatedAt: new Date(),
          })
          .where(eq(payments.externalPaymentId, paymentIntent.id));

        // Update reservation status
        await db.update(reservations)
          .set({ 
            status: 'awaiting_payment',
            updatedAt: new Date(),
          })
          .where(eq(reservations.id, reservationId));

        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).send(`Webhook handler failed: ${error.message}`);
  }
}
