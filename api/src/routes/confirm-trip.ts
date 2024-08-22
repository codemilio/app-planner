import type { FastifyInstance } from 'fastify'
import nodemailer from 'nodemailer'
import z from 'zod'

import { dayjs } from '../lib/dayjs'
import { getMailClient } from '../lib/mail'
import { prisma } from '../lib/prisma'


export async function confirmTrip(app: FastifyInstance) {
  app.get('/trips/:tripId/confirm', async (request, reply) => {
    const schema = z.object({
      tripId: z.string().uuid()
    })

    const parsed = schema.safeParse(request.params)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { tripId } = request.params as any
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        participants: {
          where: {
            is_owner: false
          }
        }
      }
    })

    if (!trip) {
      return reply.status(404).send({ error: 'Trip not found.' })
    }

    if (trip.is_confirmed) {
      return reply.redirect(`http://localhost:3000/trips/${tripId}`)
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { is_confirmed: true }
    })

    const formattedStartDate = dayjs(trip.starts_at).format("LL")
    const formattedEndDate = dayjs(trip.ends_at).format("LL")

    const mail = await getMailClient()
    
    await Promise.all([
      trip.participants.map(async (participant) => {
        const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`

        const message = await mail.sendMail({
          from: {
            name: 'Planner',
            address: 'contato@planner.com',
          },
          to: {
            name: participant.name,
            address: participant.email,
          },
          subject: `Confirme sua presença na viagem para ${trip.participants} em ${formattedStartDate} à ${formattedEndDate}`,
          html: `<a href="${confirmationLink}"> Confirmar viagme </a> `.trim(),
        })
        console.log(nodemailer.getTestMessageUrl(message))
      })
    ])

    return reply.redirect(`http://localhost:3000/trips/${tripId}`)
  })
}