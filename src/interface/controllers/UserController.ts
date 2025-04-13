import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ChangePasswordType } from '../../shared/types/Forms'

import { User } from '../../domain/entities/User'

import {
	ChangePasswordController,
	CreateUserController,
	DeleteUserController,
	LoginController,
	LogoutController,
	PasswordRecoveryController,
	UpdateUserController,
	ValidateTokenController,
} from './UserControllers'

import {
	ChangePasswordUseCase,
	CreateUserUseCase,
	DeleteUserUseCase,
	LoginUseCase,
	LogoutUseCase,
	PasswordRecoveryUseCase,
	UpdateUserUseCase,
	ValidateTokenUseCase,
} from '@user/'

import { PrismaUserRepository, PrismaTokenBlacklistRepository } from '@prisma/'
import { MailerAdapter } from '../../infrastructure/email'
import { HasherAdapter, TokenAdapter } from '../../infrastructure/security'
import { Server } from 'domain/services/Server'

export default class UserController {
	constructor(server: Server<FastifyRequest, FastifyReply>) {
		const userRepo = new PrismaUserRepository()
		const tokenRepo = new PrismaTokenBlacklistRepository()
		const hasher = new HasherAdapter()
		const token = new TokenAdapter()
		const mailer = new MailerAdapter()

		// CREATE
		const createUseCase = new CreateUserUseCase(userRepo, hasher, token, mailer)
		const createUserController = new CreateUserController(createUseCase)
		server.post('/users', async (request, reply) => {
			const user = request.body as User

			const response = await createUserController.handle(user)

			reply.code(response.status).send(response.body)
		})

		// RECOVERY PASSWORD
		const recoveryPasswordUseCase = new PasswordRecoveryUseCase(
			userRepo,
			token,
			mailer,
		)
		const recoveryPasswordUserController = new PasswordRecoveryController(
			recoveryPasswordUseCase,
		)
		server.post('/password-recovery', async (request, reply) => {
			const { email } = request.body as { email: string }

			const response = await recoveryPasswordUserController.handle(email)

			reply.code(response.status).send(response.body)
		})

		// VALIDATE TOKEN
		const validateTokenUseCase = new ValidateTokenUseCase(userRepo, token)
		const validateTokenController = new ValidateTokenController(
			validateTokenUseCase,
		)
		server.get('/validate-token', async (request, reply) => {
			const { token } = request.query as { token: string }

			const response = await validateTokenController.handle(token)

			reply.code(response.status).send(response.body)
		})

		// LOGIN
		const loginUseCase = new LoginUseCase(userRepo, hasher, token)
		const loginController = new LoginController(loginUseCase)
		server.post('/login', async (request, reply) => {
			let authorization = request.headers.authorization as string
			authorization = authorization.replace('Basic ', '')

			const [email, password] = atob(authorization).split(':')

			const response = await loginController.handle(email, password)

			reply.code(response.status).send(response.body)
		})

		// CHANGE PASSWORD
		const changePasswordUseCase = new ChangePasswordUseCase(
			userRepo,
			token,
			hasher,
		)
		const changePasswordController = new ChangePasswordController(
			changePasswordUseCase,
		)
		server.post('/change-password', async (request, reply) => {
			const data = request.body as ChangePasswordType

			const response = await changePasswordController.handle(data)

			reply.code(response.status).send(response.body)
		})

		// ###### AUTHENTICATED ROUTES ######
		const middlewares = server.authenticate ? [server.authenticate] : []

		// LOGOUT
		const logoutUseCase = new LogoutUseCase(tokenRepo)
		const logoutController = new LogoutController(logoutUseCase)
		server.post(
			'/logout',
			async (request, reply) => {
				const bearerToken = request.headers.authorization as string

				const response = await logoutController.handle(bearerToken)

				reply.code(response.status).send(response.body ?? null)
			},
			{
				middlewares,
			},
		)

		// UPDATE
		const updateUseCase = new UpdateUserUseCase(userRepo, hasher)
		const updateUserController = new UpdateUserController(updateUseCase)
		server.put(
			'/users/:userId',
			async (request, reply) => {
				const { userId } = request.params as { userId: string }
				const user = request.body as User

				const response = await updateUserController.handle({
					...user,
					id: userId,
				})

				reply.code(response.status).send(response.body)
			},
			{
				middlewares,
			},
		)

		// DELETE
		const deleteUseCase = new DeleteUserUseCase(userRepo)
		const deleteUserController = new DeleteUserController(deleteUseCase)
		server.delete(
			'/users/:userId',
			async (request, reply) => {
				const { userId } = request.params as { userId: string }
				const { userId: loggedUserId } = request.user as { userId: string }

				const response = await deleteUserController.handle(userId, loggedUserId)

				reply.code(response.status).send(response.body)
			},
			{
				middlewares,
			},
		)
	}
}
