import fastify from 'fastify'

import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'

const app = fastify()

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})