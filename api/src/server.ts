import fastify from 'fastify'

import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'
import { createTrip } from './routes/create-trip'
import { createActivity } from './routes/create-activity'
import { createLink } from './routes/create-link'
import { getActivities } from './routes/get-activities'
import { getLink } from './routes/get-links'

const app = fastify()

app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createTrip)
app.register(createActivity)
app.register(createLink)
app.register(getActivities)
app.register(getLink)

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})