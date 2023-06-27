import { FastifyInstance } from "fastify"
import axios from "axios"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function authRoutes(app: FastifyInstance){
  app.post('/register', async(request) => {
    const bodySchema = z.object({
      code: z.string(),
    })
    
    const { code} = bodySchema.parse(request.body)
   
    const acessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        }
      }
    )
    const { access_token } = acessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user',{
      headers: {
        Authorization: `bearer ${access_token}`,
      },
    })
    //validçaão de dados 
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })
  
    const userInfo = userSchema.parse(userResponse.data)
    // verificando se o user ja existe no banco de dados pelo ID
    let user = await prisma.user.findUnique({
      where: {
        githudId: userInfo.id,
      }
    })
    // se não existe no banco de dados ele cria novo user
    if (!user) {
      user = await prisma.user.create({
        data: {
          githudId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        }
      })
    }
    
    const token = app.jwt.sign(
      {// nesse primeiro objeto se coloca informações publica da coisa em questão no caso aqui user não é bom ser informações sensiveis
        name: user.name,
        avatarUrl: user.avatarUrl,
    },
    { // segundo objeto se coloca sub: ( com alguma infomação unica) e em quanto tempo expira expiresIn:
      sub: user.id,
      expiresIn: '30 days',
    },
    )
    return{
      token, 
    }
  })
}