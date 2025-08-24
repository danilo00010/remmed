import { FastifyServerAdapter } from 'infrastructure/http/FastifyServerAdapter'
import { IsBlackListedUseCase } from './application/usecases/Token/IsBlackListedUseCase'
import { PrismaTokenBlacklistRepository } from './infrastructure/db/prisma/repositories/PrismaTokenBlacklistRepository'
import dotenv from 'dotenv'
import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import UserController from './interface/controllers/UserController'
import ReminderController from './interface/controllers/ReminderController'

dotenv.config()

const DEFAULT_PORT = process.env.API_PORT
	? parseInt(process.env.API_PORT)
	: 3000

const fastify = Fastify()

await fastify.register(jwt, {
	secret: process.env.JWT_SECRET as string,
})

await fastify.register(rateLimit, {
	max: 50,
	timeWindow: '1 minute',
})

await fastify.register(swagger, {
	swagger: {
		info: {
			title: 'RemMed API',
			description: 'Documentação da API com Swagger',
			version: '1.0.0',
		},
		host: `localhost:${DEFAULT_PORT}`,
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
	},
})

await fastify.register(swaggerUi, {
	routePrefix: '/docs',
	uiConfig: {
		docExpansion: 'full',
		deepLinking: false,
	},
	staticCSP: true,
	transformSpecification: (swaggerObject, request, reply) => {
		return swaggerObject
	},
	transformSpecificationClone: true,
})

const server = new FastifyServerAdapter(fastify)

server.get('/', (_, reply) => {
	reply.send('RemMed API!')
})

new UserController(server)
new ReminderController(server)

fastify.listen({ port: DEFAULT_PORT, host: '0.0.0.0' }, err => {
	if (err) {
		throw err
	}

	console.log(`Server listening on port ${DEFAULT_PORT}`)
	console.log(`📖 Swagger docs em http://localhost:${DEFAULT_PORT}/docs`)
})
