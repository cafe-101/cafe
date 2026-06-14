import { FastifyPluginAsync } from 'fastify'
import { createAuditLog } from '@cafe/core'
import { AuditAction } from '@cafe/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-05-27.dahlia' // Example recent version
})

const stripeWebhooks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/stripe', { config: { rawBody: true } }, async function (request, reply) {
    const headers = request.headers
    
    const sig = headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    
    if (!sig) {
      return reply.code(401).send({ error: 'Missing stripe signature' })
    }

    const payload = (request as any).rawBody || '';
    
    let event: any; // using any since StripeConstructor doesn't export Event
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
      fastify.log.error(err.message);
      return reply.code(401).send({ error: 'Invalid stripe signature' });
    }
    
    const eventType = event.type
    
    let action: AuditAction | 'OTHER' = 'OTHER'
    let entityId: string | undefined = undefined
    
    if (eventType === 'payment_intent.succeeded' || eventType === 'checkout.session.completed') {
      action = 'PURCHASE'
      entityId = (event.data.object as any).id
    } else if (eventType === 'payment_intent.canceled' || eventType === 'checkout.session.expired') {
      action = 'CANCELLATION'
      entityId = (event.data.object as any).id
    }

    if (action !== 'OTHER') {
      await createAuditLog({
        action: action as AuditAction,
        entityId: entityId,
        entityType: 'Order',
        ipAddress: request.ip,
        deviceInfo: request.headers['user-agent'],
        metadata: {
          eventType,
          amount: (event.data.object as any).amount,
          currency: (event.data.object as any).currency
        }
      })
    }
    
    return { success: true }
  })
}

export default stripeWebhooks;
