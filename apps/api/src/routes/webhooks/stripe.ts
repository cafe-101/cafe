import { FastifyPluginAsync } from 'fastify'
import { createAuditLog } from '@cafe/core'

const stripeWebhooks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/stripe', async function (request, reply) {
    const payload = request.body as any
    // const headers = request.headers
    
    // TODO: Verify the webhook signature using stripe library
    // const sig = headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
    
    const event = payload
    const eventType = event.type
    
    let action = 'OTHER'
    let entityId = undefined
    
    if (eventType === 'payment_intent.succeeded' || eventType === 'checkout.session.completed') {
      action = 'PURCHASE'
      entityId = event.data?.object?.id
    } else if (eventType === 'payment_intent.canceled' || eventType === 'checkout.session.expired') {
      action = 'CANCELLATION'
      entityId = event.data?.object?.id
    }

    if (action !== 'OTHER') {
      await createAuditLog({
        // @ts-ignore
        action: action as any,
        entityId: entityId,
        entityType: 'Order',
        ipAddress: request.ip,
        deviceInfo: request.headers['user-agent'],
        metadata: {
          eventType,
          amount: event.data?.object?.amount,
          currency: event.data?.object?.currency
        }
      })
    }
    
    return { success: true }
  })
}

export default stripeWebhooks;
