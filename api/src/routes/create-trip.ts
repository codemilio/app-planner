import type { FastifyInstance } from 'fastify'
import nodemailer from 'nodemailer'
import z from 'zod'

import { dayjs } from '../lib/dayjs'
import { getMailClient } from '../lib/mail'
import { prisma } from '../lib/prisma'
import { env } from '../../env'


export async function createTrip(app: FastifyInstance) {
  app.post('/register-trip', async (request, reply) => {
    const schema = z.object({
      destination: z.string().min(4),
      starts_at: z.coerce.date(),
      ends_at: z.coerce.date(),
      owner_name: z.string(),
      owner_email: z.string().email(),
      users_to_invite: z.array(z.object({
        name: z.string(),
        email: z.string().email()
      }))
    })

    const parsed = schema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { destination, starts_at, ends_at, owner_name, owner_email, users_to_invite } = parsed.data

    if (dayjs(starts_at).isBefore(new Date())) {
      return reply.status(400).send({ error: 'Invalid trip start date' })
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      return reply.status(400).send({ error: 'Invalid trip end date' })
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true
              },
              ...users_to_invite.map(user => {
                return {
                  name: user.name,
                  email: user.email
                }
              })
            ]
          }
        }
      },
    })

    const formattedStartDate = dayjs(starts_at).format("LL")
    const formattedEndDate = dayjs(ends_at).format("LL")

    const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`

    const mail = await getMailClient()
    const message = await mail.sendMail({
      from: {
        name: 'Planner',
        address: 'contato@planner.com',
      },
      to: {
        name: owner_name,
        address: owner_email,
      },
      subject: 'Viagem Criada com Sucesso!',
      html: `<p>Sua viagem para ${destination} em ${formattedStartDate} até ${formattedEndDate} foi agendada com sucesso: <a href="${confirmationLink}"> Confirmar viagem. </a></p> `.trim(),
      // TO-DO: create e-mail template with {{ mustache }}
    })

    console.log(nodemailer.getTestMessageUrl(message))
    return { tripId: trip.id }
  })
}