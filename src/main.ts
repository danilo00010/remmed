import { FastifyServerAdapter } from 'infrastructure/http/FastifyServerAdapter'
import { IsBlackListedUseCase } from './application/usecases/Token/IsBlackListedUseCase'
import { PrismaTokenBlacklistRepository } from './infrastructure/db/prisma/repositories/PrismaTokenBlacklistRepository'
import dotenv from 'dotenv'
import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import UserController from './interface/controllers/UserController'

dotenv.config()

const DEFAULT_PORT = process.env.API_PORT
	? parseInt(process.env.API_PORT)
	: 3000

const fastify = Fastify()

await fastify.register(jwt, {
	secret: process.env.JWT_SECRET as string,
})

const server = new FastifyServerAdapter(fastify)

new UserController(server)

fastify.listen({ port: DEFAULT_PORT }, (err, address) => {
	if (err) throw err
	console.log(`Server running at ${address}`)
})
