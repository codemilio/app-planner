import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '../lib/prisma'

export async function getParticipants(app: FastifyInstance) {
  app.get('/trips/:tripId/participants', async (request, reply) => {
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
      include: {
        participants: {
          select: { id: true, name: true, email: true, is_confirmed: true }
        }
      }
    })

    if (!trip) {
      return reply.status(404).send({
        error: 'Trip not found.'
      })
    }

    return {
      participants: trip.participants
    }
  })
}