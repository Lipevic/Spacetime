import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { resolve } from "node:path"

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'),{
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(authRoutes)
app.register(uploadRoutes )
app.register (cors,{
  origin: true, // se for colocar em produdação o correto é utilizar todas as URL que vão precisar acessar o backend 
  //aqui com o origin:'true' quer dizer que todas as URL de frontend poderão acessar nosso backend
})
app.register (jwt,{
  secret: 'spacetime', // aqui vai em que a criptografia vai se basear para criptografar no caso "spacetime" mas poderia ser qualquer coisa.
})
app.register (memoriesRoutes)

app
.listen({
  port: 3333,
  //host: '0.0.0.0',
  // host: '0.0.0.0', adcionado na parte do mobile e tava dando erro no codigo
})
.then(() => {
  console.log('🚀HTTP server ruinning on http://localhost:3333')
})
