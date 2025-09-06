import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeleteReminderUseCase } from '../../application/usecases/Reminder/DeleteReminderUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { Authorization } from '../../domain/services/Authorization'
import { Reminder } from '../../domain/entities/Reminder'

let createReminderUseCase: CreateReminderUseCase
let deleteReminderUseCase: DeleteReminderUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
	deleteReminderUseCase = new DeleteReminderUseCase(repo)

	vi.restoreAllMocks()
})

describe('DeleteReminderUseCase', () => {
	it('should delete reminder if user is the owner', async () => {
		const reminder: Reminder = {
			userId: 'owner-1',
			name: 'Ibuprofeno',
			status: true,
			startTime: new Date(),
			interval: 12,
		}

		const created = await createReminderUseCase.execute(reminder)

		const spy = vi
			.spyOn(Authorization, 'assertOwnership')
			.mockImplementation(() => true)

		const result = await deleteReminderUseCase.execute(
			created.id as string,
			'owner-1',
		)

		expect(result).toBeNull()
		expect(spy).toHaveBeenCalledWith('owner-1', 'owner-1', 'Reminder')
	})

	it('should throw error if reminder does not exist', async () => {
		await expect(
			deleteReminderUseCase.execute('non-existent-id', 'any-user'),
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
			deleteReminderUseCase.execute(created.id as string, 'other-user'),
		).rejects.toThrow('Not authorized!')
	})
})
