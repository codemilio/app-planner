import fastify from 'fastify'
import { prisma } from './lib/prisma'

import { createTrip } from './routes/create-trip'

const app = fastify()

app.register(createTrip)

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})