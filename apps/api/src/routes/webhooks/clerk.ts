import { FastifyPluginAsync } from 'fastify'
import { createAuditLog } from '@cafe/core'

const clerkWebhooks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/clerk', async function (request, reply) {
    const payload = request.body as any
    // const headers = request.headers
    
    // TODO: Verify the webhook signature using svix
    // const svix_id = headers["svix-id"] as string;
    // const svix_timestamp = headers["svix-timestamp"] as string;
    // const svix_signature = headers["svix-signature"] as string;
    // ... verification logic ...
    
    const evt = payload
    const { id } = evt.data
    const eventType = evt.type
    
    let action = 'OTHER'
    if (eventType === 'user.created') {
      action = 'SIGN_UP'
    } else if (eventType === 'session.created') {
      action = 'SIGN_IN'
    } else if (eventType === 'session.ended' || eventType === 'session.removed') {
      action = 'SIGN_OUT'
    }

    if (action !== 'OTHER') {
      await createAuditLog({
        // @ts-ignore - 'OTHER' is technically an AuditAction enum value in the DB but TS might complain if not imported exactly
        action: action as any,
        entityId: id,
        entityType: 'User',
        userId: id,
        ipAddress: request.ip,
        deviceInfo: request.headers['user-agent'],
        metadata: {
          eventType,
        }
      })
    }
    
    return { success: true }
  })
}

export default clerkWebhooks;
