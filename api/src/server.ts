import fastify from 'fastify'

const app = fastify()

app.get('/teste', (req, res) => {
  return 'Hello world'
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server runing')
})