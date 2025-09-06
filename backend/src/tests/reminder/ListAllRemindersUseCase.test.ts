import { beforeEach, describe, expect, it } from 'vitest'
import { ListAllRemindersUseCase } from '../../application/usecases/Reminder/ListAllRemindersUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { Reminder } from 'domain/entities/Reminder'

let createReminderUseCase: CreateReminderUseCase
let listAllRemindersUseCase: ListAllRemindersUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
	listAllRemindersUseCase = new ListAllRemindersUseCase(repo)
})

describe('ListAllRemindersUseCase', () => {
	it('should return all reminders for a user', async () => {
		const reminders: Reminder[] = [
			{
				userId: 'user-1',
				name: 'Reminder 1',
				status: true,
				startTime: new Date(),
				interval: 15,
			},
			{
				userId: 'user-1',
				name: 'Reminder 2',
				status: false,
				startTime: new Date(),
				interval: 30,
			},
		]

		for (const r of reminders) {
			await createReminderUseCase.execute(r)
		}

		const result = await listAllRemindersUseCase.execute('user-1')

		expect(result).toHaveLength(2)
		expect(result?.map(r => r.name)).toEqual(['Reminder 1', 'Reminder 2'])
	})

	it('should return null if user has no reminders', async () => {
		const result = await listAllRemindersUseCase.execute('user-unknown')
		expect(result).toBeNull()
	})
})
