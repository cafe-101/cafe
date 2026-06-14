import { FastifyPluginAsync } from 'fastify'

const dummyPlugin: FastifyPluginAsync = async (fastify, opts) => {
  // Empty placeholder plugin so TypeScript compiles the 'plugins' directory
}

export default dummyPlugin
