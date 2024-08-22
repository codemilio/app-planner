import type { FastifyInstance } from 'fastify'
import z from 'zod'


export async function confirmTrip(app: FastifyInstance) {
  app.get('/trips/:tripId/confirm-trip', async (request, reply) => {
    const schema = z.object({
      tripId: z.string().uuid()
    })

    const parsed = schema.safeParse(request.params)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { tripId } = request.params as any
    return { tripId: tripId }
  })
}