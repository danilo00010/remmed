import dotenv from 'dotenv'
import Fastify from 'fastify'

dotenv.config()

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

const fastify = Fastify()

fastify.listen({ port: DEFAULT_PORT }, (err, address) => {
	if (err) throw err
	console.log(`Server running at ${address}`)
})
