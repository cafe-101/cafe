import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { prisma, PrismaClient } from '@cafe/db'

// Use TypeScript declaration merging to add the PrismaClient to the FastifyInstance
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

/**
 * Fastify plugin for integrating Prisma ORM.
 * Decorates the fastify instance with a prisma client and handles graceful shutdown.
 * @param {FastifyInstance} fastify - The fastify instance.
 * @param {object} opts - Plugin options.
 */
const prismaPlugin: FastifyPluginAsync = async (fastify, opts) => {
  // Make Prisma accessible through fastify.prisma
  if (!fastify.hasDecorator('prisma')) {
    fastify.decorate('prisma', prisma)
  }

  fastify.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
}

export default fp(prismaPlugin, {
  name: 'prisma'
})
