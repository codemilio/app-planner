import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { dayjs } from '../lib/dayjs'
import { parse } from 'path'

export async function createActivity(app: FastifyInstance) {
  app.post('/trips/:tripId/activities', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        occurs_at: z.coerce.date()
      })
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }
    
    const { tripId } = parsed.data.params
    const { title, occurs_at } = parsed.data.body

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

    if(dayjs(occurs_at).isBefore(trip.starts_at)) {
      console.log(trip.starts_at)
      return reply.status(400).send({ 
        error: 'Invalid activity start date.'
      })
    }

    if(dayjs(occurs_at).isAfter(trip.ends_at)) {
      console.log(trip.ends_at)
      return reply.status(400).send({ 
        error: 'Invalid activity end date.'
      })
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        occurs_at: dayjs(occurs_at).toISOString(),
        trip_id: tripId
      }
    })

    return {
      activityId: activity.id
    }

  })
}