import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { dayjs } from '../lib/dayjs'
import { prisma } from '../lib/prisma'

export async function updateTrip(app: FastifyInstance) {
  app.put('/trips/:tripId', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
      })
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { tripId } = parsed.data.params
    const { destination, starts_at, ends_at } = parsed.data.body

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    })
    
    if (!trip) {
      return reply.status(404).send({
        error: 'Trip not found.'
      })
    }

    if (dayjs(starts_at).isBefore(new Date())) {
      console.log(starts_at)
      return reply.status(400).send({ error: 'Invalid trip start date' })
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      console.log(ends_at)
      return reply.status(400).send({ error: 'Invalid trip end date' })
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        destination,
        starts_at,
        ends_at
      }
    })

    return { trip: tripId }
  })
}