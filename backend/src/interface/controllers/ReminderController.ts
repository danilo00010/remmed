import type { FastifyReply, FastifyRequest } from 'fastify'

import { Reminder } from 'domain/entities/Reminder'

import {
	CreateReminderController,
	ReadReminderController,
	ListAllRemindersController,
	UpdateReminderController,
	DeleteReminderController,
	ToggleReminderController,
	ListArchivedsController,
} from './ReminderControllers'

import {
	CreateReminderUseCase,
	ReadReminderUseCase,
	ListAllRemindersUseCase,
	UpdateReminderUseCase,
	DeleteReminderUseCase,
	ToggleReminderUseCase,
	ListArchivedsUseCase,
} from '@reminder/'

import { PrismaReminderRepository } from '@prisma/'
import { Server } from 'domain/services/Server'
import { CrypterAdapter } from 'infrastructure/security'

export default class ReminderController {
	constructor(server: Server<FastifyRequest, FastifyReply>) {
		const reminderRepo = new PrismaReminderRepository()
		const crypter = new CrypterAdapter()

		// ###### AUTHENTICATED ROUTES ######
		const middlewares = server.authenticate ? [server.authenticate] : []

		// CREATE
		const createUseCase = new CreateReminderUseCase(reminderRepo, crypter)
		const createReminderController = new CreateReminderController(createUseCase)
		server.post(
			'/reminders',
			async (request, reply) => {
				const { userId } = request.user as { userId: string }

				const reminder = request.body as Reminder

				const response = await createReminderController.handle({
					...reminder,
					userId,
				})

				reply.code(response.status).send(response.body)
			},
			{
				middlewares,
			},
		)

		// READ
		const readUseCase = new ReadReminderUseCase(reminderRepo)
		const readController = new ReadReminderController(readUseCase)
		server.get(
			'/reminders/:reminderId',
			async (request, reply) => {
				const { reminderId } = request.params as { reminderId: string }
				const { userId } = request.user as { userId: string }

				const response = await readController.handle(reminderId, userId)

				reply.code(response.status).send(response.body)
			},
			{ middlewares },
		)

		// UPDATE
		const updateUseCase = new UpdateReminderUseCase(reminderRepo)
		const updateReminderController = new UpdateReminderController(updateUseCase)
		server.put(
			'/reminders/:reminderId',
			async (request, reply) => {
				const { reminderId } = request.params as { reminderId: string }
				const { userId } = request.user as { userId: string }

				const reminder = request.body as Reminder

				reminder.id = reminderId
				reminder.userId = userId

				const response = await updateReminderController.handle(reminder)

				reply.code(response.status).send(response.body)
			},
			{ middlewares },
		)

		// DELETE
		const deleteUseCase = new DeleteReminderUseCase(reminderRepo)
		const deleteReminderController = new DeleteReminderController(deleteUseCase)
		server.delete(
			'/reminders/:reminderId',
			async (request, reply) => {
				const { reminderId } = request.params as { reminderId: string }
				const { userId } = request.user as { userId: string }

				const response = await deleteReminderController.handle(
					reminderId,
					userId,
				)

				reply.code(response.status).send(response.body)
			},
			{ middlewares },
		)

		// LIST ARCHIVEDS
		const listArchivedsUseCase = new ListArchivedsUseCase(reminderRepo)
		const listArchivedsController = new ListArchivedsController(
			listArchivedsUseCase,
		)
		server.get(
			'/reminders/archiveds',
			async (request, reply) => {
				const { userId } = request.user as { userId: string }

				const response = await listArchivedsController.handle(userId)

				reply.code(response.status).send(response.body)
			},
			{ middlewares },
		)

		// TOGGLE
		const toggleUseCase = new ToggleReminderUseCase(reminderRepo)
		const toggleController = new ToggleReminderController(toggleUseCase)
		server.get(
			'/reminders/toggle/:reminderId',
			async (request, reply) => {
				const { reminderId } = request.params as { reminderId: string }
				const { userId } = request.user as { userId: string }

				const response = await toggleController.handle(reminderId, userId)

				reply.code(response.status).send(response.body)
			},
			{ middlewares },
		)

		// LIST ALL
		const listAllRemindersUseCase = new ListAllRemindersUseCase(reminderRepo)
		const listAllRemindersController = new ListAllRemindersController(
			listAllRemindersUseCase,
		)
		server.get(
			'/reminders',
			async (request, reply) => {
				const { userId } = request.user as { userId: string }

				const response = await listAllRemindersController.handle(userId)

				reply.code(response.status).send(response.body)
			},
			{ middlewares },
		)
	}
}
