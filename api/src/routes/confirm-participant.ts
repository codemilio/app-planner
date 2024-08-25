import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { env } from '../../env'
import { prisma } from '../lib/prisma'

export async function confirmParticipant(app: FastifyInstance) {
	app.get('/participants/:participantId/confirm', async (request, reply) => {
		const schema = z.object({
			participantId: z.string().uuid(),
		})

		const parsed = schema.safeParse(request.params)

		if (!parsed.success) {
			return reply.status(400).send({ error: parsed.error.errors })
		}

		const { participantId } = parsed.data
		const participant = await prisma.participant.findUnique({
			where: {
				id: participantId,
			},
		})

		if (!participant) {
			return reply.status(404).send({ error: 'Participant not found.' })
		}

		if (participant.is_confirmed) {
			return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`)
		}

		await prisma.participant.update({
			where: { id: participantId },
			data: { is_confirmed: true },
		})

		return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`)
	})
}
