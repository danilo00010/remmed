import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Middleware, Server } from '../../domain/services/Server'
import { PrismaTokenBlacklistRepository } from '@prisma/'
import { IsBlackListedUseCase } from 'application/usecases/Token/IsBlackListedUseCase'

export class FastifyServerAdapter
	implements Server<FastifyRequest, FastifyReply>
{
	constructor(private readonly fastify: FastifyInstance) {
		this.authenticate = this.adaptAuthenticate()
	}

	public authenticate: Middleware<FastifyRequest, FastifyReply>

	private adaptAuthenticate(): Middleware<FastifyRequest, FastifyReply> {
		return async (req, res, next) => {
			try {
				await req.jwtVerify()

				const tokenBlacklistRepo = new PrismaTokenBlacklistRepository()
				const isBlackListedUseCase = new IsBlackListedUseCase(
					tokenBlacklistRepo,
				)

				const bearerToken = req.headers.authorization as string

				const isBlacklisted = await isBlackListedUseCase.execute(bearerToken)

				if (isBlacklisted) {
					return res.status(401).send({ message: 'Unauthorized' })
				}

				next()
			} catch (err) {
				return res.status(401).send({ message: 'Unauthorized' })
			}
		}
	}

	private applyMiddlewares(
		middlewares?: Middleware<FastifyRequest, FastifyReply>[],
	) {
		if (!middlewares) return []

		return middlewares.map(
			mw => async (request: FastifyRequest, reply: FastifyReply) => {
				let nextCalled = false

				await mw(request, reply, () => {
					nextCalled = true
				})

				if (!nextCalled) {
					throw new Error('Middleware dit not call next()')
				}
			},
		)
	}

	get(
		uri: string,
		callback: (req: FastifyRequest, res: FastifyReply) => void,
		options?: { middlewares?: Middleware<FastifyRequest, FastifyReply>[] },
	): void {
		this.fastify.get(
			uri,
			{ onRequest: this.applyMiddlewares(options?.middlewares) },
			async (request, reply) => callback(request, reply),
		)
	}

	post(
		uri: string,
		callback: (req: FastifyRequest, res: FastifyReply) => void,
		options?: { middlewares?: Middleware<FastifyRequest, FastifyReply>[] },
	): void {
		this.fastify.post(
			uri,
			{ onRequest: this.applyMiddlewares(options?.middlewares) },
			async (request, reply) => callback(request, reply),
		)
	}

	put(
		uri: string,
		callback: (req: FastifyRequest, res: FastifyReply) => void,
		options?: { middlewares?: Middleware<FastifyRequest, FastifyReply>[] },
	): void {
		this.fastify.put(
			uri,
			{ onRequest: this.applyMiddlewares(options?.middlewares) },
			async (request, reply) => callback(request, reply),
		)
	}

	patch(
		uri: string,
		callback: (req: FastifyRequest, res: FastifyReply) => void,
		options?: { middlewares?: Middleware<FastifyRequest, FastifyReply>[] },
	): void {
		this.fastify.patch(
			uri,
			{ onRequest: this.applyMiddlewares(options?.middlewares) },
			async (request, reply) => callback(request, reply),
		)
	}

	delete(
		uri: string,
		callback: (req: FastifyRequest, res: FastifyReply) => void,
		options?: { middlewares?: Middleware<FastifyRequest, FastifyReply>[] },
	): void {
		this.fastify.delete(
			uri,
			{ onRequest: this.applyMiddlewares(options?.middlewares) },
			async (request, reply) => callback(request, reply),
		)
	}
}
