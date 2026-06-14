import { FastifyPluginAsync } from 'fastify'
import { createAuditLog } from '@cafe/core'
import { Webhook } from 'svix'
import { AuditAction } from '@cafe/db'

export type ClerkWebhookEvent = {
  data: { id: string; [key: string]: any };
  type: string;
}

const clerkWebhooks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/clerk', { config: { rawBody: true } }, async function (request, reply) {
    const headers = request.headers
    
    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;
    
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return reply.code(401).send({ error: 'Missing svix headers' })
    }

    // Determine the raw payload to verify. We need the raw string body.
    const payload = (request as any).rawBody || JSON.stringify(request.body)
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

    let evt: ClerkWebhookEvent
    try {
      evt = wh.verify(payload as string, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as ClerkWebhookEvent
    } catch (err: any) {
      fastify.log.error(err.message)
      return reply.code(401).send({ error: 'Invalid signature' })
    }
    
    const { id } = evt.data
    const eventType = evt.type
    
    let action: AuditAction | 'OTHER' = 'OTHER'
    if (eventType === 'user.created') {
      action = 'SIGN_UP'
    } else if (eventType === 'session.created') {
      action = 'SIGN_IN'
    } else if (eventType === 'session.ended' || eventType === 'session.removed') {
      action = 'SIGN_OUT'
    }

    if (action !== 'OTHER') {
      await createAuditLog({
        action: action as AuditAction,
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
