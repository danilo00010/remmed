import { Authorization } from 'domain/services/Authorization'
import { Reminder } from 'domain/entities/Reminder'
import { ReminderRepository } from 'domain/repositories/ReminderRepository'

export class UpdateReminderUseCase {
	constructor(private readonly reminderRepository: ReminderRepository) {}

	async execute(reminder: Reminder): Promise<Reminder> {
		const oldReminder = await this.reminderRepository.findById(
			reminder.id as string,
		)

		if (!oldReminder) throw new Error('Reminder not found!')

		Authorization.assertOwnership(
			oldReminder.userId,
			reminder.userId,
			'Reminder',
		)

		const newReminder = {
			...reminder,
		}

		newReminder.startTime = new Date(newReminder.startTime)

		newReminder.startTime.setSeconds(0)
		newReminder.startTime.setMilliseconds(0)

		if (reminder.archive && oldReminder.archivedAt === null) {
			newReminder.archivedAt = new Date()
		} else if (!reminder.archive && oldReminder.archivedAt !== null) {
			newReminder.archivedAt = null
		}

		return await this.reminderRepository.update(newReminder)
	}
}
