import { FastifyPluginAsync } from 'fastify'

/**
 * Fastify plugin for the root route.
 * @param {FastifyInstance} fastify - The fastify application instance.
 * @param {object} opts - Plugin options.
 */
const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { status: 'ok' }
  })
}

export default root;
