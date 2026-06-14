import { FastifyPluginAsync } from 'fastify'

const branchMenuRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // GET /branches/:branchId/menu
  fastify.get<{
    Params: { branchId: string }
  }>('/', async function (request, reply) {
    const { branchId } = request.params
    
    // Check if branch exists
    const branch = await fastify.prisma.branch.findUnique({ where: { id: branchId } })
    if (!branch) {
      return reply.code(404).send({ error: 'Branch not found' })
    }

    // Fetch the menu scoped strictly to this branchId (Multi-tenant requirement)
    const menuCategories = await fastify.prisma.menuCategory.findMany({
      where: { branchId },
      include: {
        items: true
      },
      orderBy: { sortOrder: 'asc' }
    })

    return menuCategories
  })

  // POST /branches/:branchId/menu/category
  fastify.post<{
    Params: { branchId: string },
    Body: { name: string; sortOrder?: number }
  }>('/category', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          sortOrder: { type: 'number' }
        }
      }
    }
  }, async function (request, reply) {
    const { branchId } = request.params
    const { name, sortOrder } = request.body

    const category = await fastify.prisma.menuCategory.create({
      data: {
        name,
        sortOrder: sortOrder || 0,
        branchId
      }
    })

    reply.code(201)
    return category
  })

  // POST /branches/:branchId/menu/item
  fastify.post<{
    Params: { branchId: string },
    Body: { name: string; price: number; categoryId: string; description?: string }
  }>('/item', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'price', 'categoryId'],
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
          categoryId: { type: 'string' },
          description: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    const { branchId } = request.params
    const { name, price, categoryId, description } = request.body

    // Ensure category belongs to this branch to prevent tenant-bleeding
    const category = await fastify.prisma.menuCategory.findUnique({
      where: { id: categoryId }
    })
    
    if (!category || category.branchId !== branchId) {
      return reply.code(403).send({ error: 'Invalid category for this branch' })
    }

    const item = await fastify.prisma.menuItem.create({
      data: {
        name,
        price,
        categoryId,
        branchId,
        description
      }
    })

    reply.code(201)
    return item
  })
}

export default branchMenuRoute
