import { FastifyPluginAsync } from 'fastify'

/**
 * Fastify plugin for branch routes.
 * Handles the creation and retrieval of branch records.
 * @param {FastifyInstance} fastify - The fastify application instance.
 * @param {object} opts - Plugin options.
 */
const branchesRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // GET /branches
  fastify.get<{
    Querystring: { page?: number; limit?: number }
  }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      }
    }
  }, async function (request, reply) {
    const page = Number(request.query.page) || 1
    const limit = Number(request.query.limit) || 10
    const skip = (page - 1) * limit

    const [branches, totalCount] = await Promise.all([
      fastify.prisma.branch.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      fastify.prisma.branch.count()
    ])
    
    return {
      data: branches,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
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
