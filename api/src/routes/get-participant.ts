import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '../lib/prisma'

export async function getParticipant(app: FastifyInstance) {
  app.get('/participants/:participantId', async (request, reply) => {
    const schema = z.object({
      params: z.object({
        participantId: z.string().uuid()
      }),
    })

    const parsed = schema.safeParse(request)

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.errors })
    }

    const { participantId } = parsed.data.params
    console.log(participantId)
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      select: { id: true, name: true, email: true, is_confirmed: true }
    })

    if (!participant) {
      return reply.status(404).send({
        error: 'Participant not found.'
      })
    }

    return {
      participant
    }
  })
}