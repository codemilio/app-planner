import fastify from 'fastify'

import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'
import { createTrip } from './routes/create-trip'
import { createActivity } from './routes/create-activity'
import { createLink } from './routes/create-link'
import { getActivities } from './routes/get-activities'
import { getLink } from './routes/get-links'
import { getParticipants } from './routes/get-participants'
import { createInvite } from './routes/create-invite'
import { updateTrip } from './routes/update-trip'

const app = fastify()

// Trip
app.register(confirmTrip)
app.register(createTrip)
app.register(updateTrip)

// Participants
app.register(confirmParticipant)
app.register(getParticipants)

// Link 
app.register(createLink)
app.register(getLink)

// Activities 
app.register(createActivity)
app.register(getActivities)

// Invite
app.register(createInvite)

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})