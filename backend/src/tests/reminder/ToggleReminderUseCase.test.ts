import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToggleReminderUseCase } from '../../application/usecases/Reminder/ToggleReminderUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { Authorization } from 'domain/services/Authorization'
import { Reminder } from 'domain/entities/Reminder'

let createReminderUseCase: CreateReminderUseCase
let toggleReminderUseCase: ToggleReminderUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
	toggleReminderUseCase = new ToggleReminderUseCase(repo)

	vi.restoreAllMocks()
})

describe('ToggleReminderUseCase', () => {
	it('should toggle the reminder status if user is the owner', async () => {
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

		const result = await toggleReminderUseCase.execute(
			created.id as string,
			'user-1',
		)

		expect(result.status).toBe(!reminder.status)
		expect(spy).toHaveBeenCalledWith('user-1', 'user-1', 'Reminder')
	})

	it('should throw error if reminder does not exist', async () => {
		await expect(
			toggleReminderUseCase.execute('non-existent-id', 'any-user'),
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
			toggleReminderUseCase.execute(created.id as string, 'other-user'),
		).rejects.toThrow('Not authorized!')
	})
})
