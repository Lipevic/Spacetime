import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333', // talvez colocar o ip local para evitar erro quando for decomentar a linha do server lá
})
// 192.168.0.180:3333
