import { beforeEach, describe, expect, it } from 'vitest'
import { ListArchivedsUseCase } from '../../application/usecases/Reminder/ListArchivedsUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { Reminder } from 'domain/entities/Reminder'

let createReminderUseCase: CreateReminderUseCase
let listArchivedsUseCase: ListArchivedsUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
	listArchivedsUseCase = new ListArchivedsUseCase(repo)
})

describe('ListArchivedsUseCase', () => {
	it('should return only archived reminders for a user', async () => {
		const reminders: Reminder[] = [
			{
				userId: 'user-1',
				name: 'Reminder 1',
				status: true,
				startTime: new Date(),
				interval: 15,
				archive: true,
			},
			{
				userId: 'user-1',
				name: 'Reminder 2',
				status: false,
				startTime: new Date(),
				interval: 30,
				archive: false,
			},
			{
				userId: 'user-1',
				name: 'Reminder 3',
				status: true,
				startTime: new Date(),
				interval: 10,
				archive: true,
			},
		]

		for (const r of reminders) {
			await createReminderUseCase.execute(r)
		}

		const result = await listArchivedsUseCase.execute('user-1')

		expect(result).toHaveLength(2)
		expect(result?.map(r => r.name)).toEqual(['Reminder 1', 'Reminder 3'])
	})

	it('should return null if user has no archived reminders', async () => {
		const reminders: Reminder[] = [
			{
				userId: 'user-2',
				name: 'Reminder 1',
				status: true,
				startTime: new Date(),
				interval: 15,
				archive: false,
			},
		]

		for (const r of reminders) {
			await createReminderUseCase.execute(r)
		}

		const result = await listArchivedsUseCase.execute('user-2')
		expect(result).toBeNull()
	})
})
