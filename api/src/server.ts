import fastify from 'fastify'
import cors from '@fastify/cors'
// import {
//   serializerCompiler,
//   validatorCompiler,
// } from 'fastify-type-provider-zod'

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
import { getTrip } from './routes/get-trip'
import { getParticipant } from './routes/get-participant'
import { errorHandler } from './error-handler'

const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setErrorHandler(errorHandler)

// app.setValidatorCompiler(validatorCompiler)
// app.setSerializerCompiler(serializerCompiler)

// Trip
app.register(confirmTrip)
app.register(createTrip)
app.register(updateTrip)
app.register(getTrip)

// Participants
app.register(confirmParticipant)
app.register(getParticipants)
app.register(getParticipant)

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