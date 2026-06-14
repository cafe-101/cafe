import { FastifyPluginAsync } from 'fastify'

/**
 * A dummy Fastify plugin used as a placeholder.
 * @param {FastifyInstance} fastify - The fastify instance.
 * @param {object} opts - Plugin options.
 */
const dummyPlugin: FastifyPluginAsync = async (fastify, opts) => {
  // Empty placeholder plugin so TypeScript compiles the 'plugins' directory
}

export default dummyPlugin
