import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()


app.register (cors,{
  origin: true, // se for colocar em produdação o correto é utilizar todas as URL que vão precisar acessar o backend 
  //aqui com o origin:'true' quer dizer que todas as URL de frontend poderão acessar nosso backend
})
app.register (memoriesRoutes)

app
.listen({
  port: 3333,
})
.then(() => {
  console.log('🚀HTTP server ruinning on http://localhost:3333')
})
