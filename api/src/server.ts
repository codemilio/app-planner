import fastify from 'fastify'

import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'

const app = fastify()

app.register(createTrip)
app.register(confirmTrip)

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})