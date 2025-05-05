import { ReminderRepository } from 'domain/repositories/ReminderRepository'
import { Authorization } from 'domain/services/Authorization'

export class DeleteReminderUseCase {
	constructor(private readonly reminderRepository: ReminderRepository) {}

	async execute(reminderId: string, userId: string) {
		const reminder = await this.reminderRepository.findById(reminderId)

		if (!reminder) throw new Error('Reminder not found!')

		Authorization.assertOwnership(reminder.userId, userId, 'Reminder')

		return await this.reminderRepository.delete(reminderId)
	}
}
