import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateReminderUseCase } from '../../application/usecases/Reminder/UpdateReminderUseCase'
import { CreateReminderUseCase } from '../../application/usecases/Reminder/CreateReminderUseCase'
import { InMemoryReminderRepository } from '../../infrastructure/db/memory/repositories'
import { CrypterAdapter } from '../../infrastructure/security'
import { Reminder } from 'domain/entities/Reminder'
import { Authorization } from 'domain/services/Authorization'

let createReminderUseCase: CreateReminderUseCase
let updateReminderUseCase: UpdateReminderUseCase

beforeEach(() => {
	const repo = new InMemoryReminderRepository()
	const crypter = new CrypterAdapter()

	createReminderUseCase = new CreateReminderUseCase(repo, crypter)
	updateReminderUseCase = new UpdateReminderUseCase(repo)

	vi.restoreAllMocks()
})

describe('UpdateReminderUseCase', () => {
	it('should update reminder normally', async () => {
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

		const updatedReminder: Reminder = {
			...created,
			name: 'Ibuprofeno 400mg',
			interval: 24,
		}

		const result = await updateReminderUseCase.execute(updatedReminder)

		expect(result.name).toBe('Ibuprofeno 400mg')
		expect(result.interval).toBe(24)
		expect(result.startTime.getSeconds()).toBe(0)
		expect(result.startTime.getMilliseconds()).toBe(0)
		expect(spy).toHaveBeenCalledWith('user-1', 'user-1', 'Reminder')
	})

	it('should throw error if reminder does not exist', async () => {
		const reminder: Reminder = {
			id: 'non-existent-id',
			userId: 'user-1',
			name: 'Ibuprofeno',
			status: true,
			startTime: new Date(),
			interval: 12,
		}

		await expect(updateReminderUseCase.execute(reminder)).rejects.toThrow(
			'Reminder not found!',
		)
	})

	it('should throw error if user is not the owner', async () => {
		const reminder: Reminder = {
			userId: 'user-1',
			name: 'Ibuprofeno',
			status: true,
			startTime: new Date(),
			interval: 12,
		}

		const created = await createReminderUseCase.execute(reminder)

		vi.spyOn(Authorization, 'assertOwnership').mockImplementation(() => {
			throw new Error('Not authorized!')
		})

		const updatedReminder: Reminder = { ...created, name: 'Ibuprofeno 400mg' }

		await expect(
			updateReminderUseCase.execute(updatedReminder),
		).rejects.toThrow('Not authorized!')
	})

	it('should handle archive and archivedAt correctly', async () => {
		const reminder: Reminder = {
			userId: 'user-1',
			name: 'Ibuprofeno',
			status: true,
			startTime: new Date(),
			interval: 12,
			archive: false,
			archivedAt: null,
		}

		const created = await createReminderUseCase.execute(reminder)

		vi.spyOn(Authorization, 'assertOwnership').mockImplementation(() => true)

		const archivedReminder: Reminder = { ...created, archive: true }
		const resultArchived = await updateReminderUseCase.execute(archivedReminder)

		expect(resultArchived.archive).toBe(true)
		expect(resultArchived.archivedAt).toBeInstanceOf(Date)

		const unarchivedReminder: Reminder = { ...resultArchived, archive: false }
		const resultUnarchived =
			await updateReminderUseCase.execute(unarchivedReminder)

		expect(resultUnarchived.archive).toBe(false)
		expect(resultUnarchived.archivedAt).toBeNull()
	})
})
