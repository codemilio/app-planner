import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '../lib/prisma'

export async function getTrip(app: FastifyInstance) {
  app.get('/trips/:tripId/details', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        tripId: z.string().uuid()
      }),
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { tripId } = parsed.data.params

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        id: true,
        destination: true,
        created_at: true,
        starts_at: true,
        ends_at: true,
        is_confirmed: true,
      }
    })
    
    if (!trip) {
      return reply.status(404).send({
        error: 'Trip not found.'
      })
    }

    return { trip }
  })
}