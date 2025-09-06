import { beforeEach, describe, expect, it } from 'vitest'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { Reminder } from 'domain/entities/Reminder'

let createReminderUseCase: CreateReminderUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
})

describe('CreateReminderUseCase', () => {
	it('should create a reminder with generated id', async () => {
		const reminder: Reminder = {
			userId: 'user-1',
			name: 'Cimegripe',
			status: true,
			startTime: new Date(),
			interval: 30,
		}

		const result = await createReminderUseCase.execute(reminder)

		expect(result.id).toBeDefined()
		expect(result.id).not.toBe('')
	})

	it('should normalize startTime to remove seconds and milliseconds', async () => {
		const startTime = new Date()
		startTime.setSeconds(45)
		startTime.setMilliseconds(500)

		const reminder: Reminder = {
			userId: 'user-2',
			name: 'Loratadina',
			status: true,
			startTime,
			interval: 15,
		}

		const result = await createReminderUseCase.execute(reminder)

		expect(result.startTime.getSeconds()).toBe(0)
		expect(result.startTime.getMilliseconds()).toBe(0)
	})

	it('should persist reminder in repository', async () => {
		const reminder: Reminder = {
			userId: 'user-3',
			name: 'Dipirona',
			status: false,
			startTime: new Date(),
			interval: 60,
		}

		const result = await createReminderUseCase.execute(reminder)

		const repo = (createReminderUseCase as any)
			.reminderRepository as InMemoryReminderRepository
		const saved = await repo.findById(result.id as string)

		expect(saved).toEqual(result)
	})
})
