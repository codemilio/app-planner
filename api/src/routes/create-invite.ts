import type { FastifyInstance } from 'fastify'
import nodemailer from 'nodemailer'
import z from 'zod'

import { prisma } from '../lib/prisma'
import { dayjs } from '../lib/dayjs'
import { getMailClient } from '../lib/mail'

export async function createInvite(app: FastifyInstance) {
  app.post('/trips/:tripId/invite', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        name: z.string(),
        email: z.string().email()
      })
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { tripId } = parsed.data.params
    const { email, name } = parsed.data.body

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if (!trip) {
      return reply.status(404).send({
        error: 'Trip not found.'
      })
    }

    const participant = await prisma.participant.create({
      data: {
        email,
        name,
        trip_id: tripId
      }
    })

    const formattedStartDate = dayjs(trip.starts_at).format("LL")
    const formattedEndDate = dayjs(trip.ends_at).format("LL")

    const mail = await getMailClient()

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
      subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate} à ${formattedEndDate}`,
      html: `<a href="${confirmationLink}"> Confirmar viagme </a> `.trim(),
    })
    console.log(nodemailer.getTestMessageUrl(message))

    return {
      participant: participant.id
    }

  })
}