import { FastifyPluginAsync } from 'fastify'

/**
 * Fastify plugin for branch routes.
 * Handles the creation and retrieval of branch records.
 * @param {FastifyInstance} fastify - The fastify application instance.
 * @param {object} opts - Plugin options.
 */
const branchesRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // GET /branches
  fastify.get('/', async function (request, reply) {
    const branches = await fastify.prisma.branch.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return branches
  })

  // POST /branches
  fastify.post<{
    Body: { name: string; address?: string }
  }>('/', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          address: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    const { name, address } = request.body

    const newBranch = await fastify.prisma.branch.create({
      data: {
        name,
        address
      }
    })
    
    reply.code(201)
    return newBranch
  })
}

export default branchesRoute
