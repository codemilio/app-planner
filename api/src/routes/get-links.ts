import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '../lib/prisma'

export async function getLink(app: FastifyInstance) {
  app.get('/trips/:tripId/link', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        tripId: z.string().uuid()
      }),
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }
    
    const { tripId } = request.params as any 

    const trip = await prisma.trip.findUnique({
      where: {  id: tripId  },
      include: { 
        links: true
      }
    })

    if(!trip) {
      return reply.status(404).send({ 
        error: 'Trip not found.'
      })
    }

    return {
      links: trip.links
    }

  })
}