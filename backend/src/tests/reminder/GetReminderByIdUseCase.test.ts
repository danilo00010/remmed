import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetReminderByIdUseCase } from '../../application/usecases/Reminder/GetReminderByIdUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { Authorization } from 'domain/services/Authorization'
import { Reminder } from 'domain/entities/Reminder'

let createReminderUseCase: CreateReminderUseCase
let getReminderByIdUseCase: GetReminderByIdUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
	getReminderByIdUseCase = new GetReminderByIdUseCase(repo)

	vi.restoreAllMocks()
})

describe('GetReminderByIdUseCase', () => {
	it('should return reminder if it exists and user is the owner', async () => {
		const reminder: Reminder = {
			userId: 'user-1',
			name: 'Ibuprofeno',
			status: true,
			startTime: new Date(),
			interval: 12,
		}

		const created = await createReminderUseCase.execute(reminder)

		const spy = vi
			.spyOn(Authorization, 'assertOwnership')
			.mockImplementation(() => true)

		const result = await getReminderByIdUseCase.execute(
			created.id as string,
			'user-1',
		)

		expect(result).toEqual(created)
		expect(spy).toHaveBeenCalledWith('user-1', 'user-1', 'Reminder')
	})

	it('should throw error if reminder does not exist', async () => {
		await expect(
			getReminderByIdUseCase.execute('non-existent-id', 'any-user'),
		).rejects.toThrow('Reminder not found!')
	})

	it('should throw error if user is not the owner', async () => {
		const reminder: Reminder = {
			userId: 'owner-2',
			name: 'Amoxicilina',
			status: false,
			startTime: new Date(),
			interval: 8,
		}

		const created = await createReminderUseCase.execute(reminder)

		vi.spyOn(Authorization, 'assertOwnership').mockImplementation(() => {
			throw new Error('Not authorized!')
		})

		await expect(
			getReminderByIdUseCase.execute(created.id as string, 'other-user'),
		).rejects.toThrow('Not authorized!')
	})
})
