import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '../lib/prisma'

export async function createLink(app: FastifyInstance) {
  app.post('/trips/:tripId/link', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        url: z.string().url()
      })
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }
    
    const { tripId } = request.params as any 
    const { title, url } = request.body as any 

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if(!trip) {
      return reply.status(404).send({ 
        error: 'Trip not found.'
      })
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId
      }
    })

    return {
      activityId: link.id
    }

  })
}