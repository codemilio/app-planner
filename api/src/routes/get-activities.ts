import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '../lib/prisma'
import { dayjs } from '../lib/dayjs'

export async function getActivities(app: FastifyInstance) {
  app.get('/trips/:tripId/activities', async (request, reply) => {
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
        activities: {
          orderBy: {
            occurs_at: 'asc'
          }
        } 
      }
    })

    if(!trip) {
      return reply.status(404).send({ 
        error: 'Trip not found.'
      })
    }

    const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(trip.starts_at, 'days')
    const activities = Array.from({ length: differenceInDaysBetweenTripStartAndEnd + 1 }).map((_, index) => {
      const date = dayjs(trip.starts_at).add(index, 'days')
      return {
        date: date.toDate(),
        activities: trip.activities.filter(activity => {
          return dayjs(activity.occurs_at).isSame(date, 'day')
        })
      }
    })

    return {
      activities
    }

  })
}