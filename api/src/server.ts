import fastify from 'fastify'
import { prisma } from './lib/prisma'

const app = fastify()

app.get('/register', async (req, res) => {
  prisma.trip.create({
    data: {
      destination: 'floripa',
      ends_at: new Date(),
      starts_at: new Date(),
    }
  })

  return 'success register'
})

app.get('/list', async (req, res) => {
  const trips = await prisma.trip.findMany()
  return trips
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})