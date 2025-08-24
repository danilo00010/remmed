import { Crypter } from 'domain/services/Crypter'
import { Reminder } from 'domain/entities/Reminder'
import { ReminderRepository } from 'domain/repositories/ReminderRepository'

export class CreateReminderUseCase {
	constructor(
		private readonly reminderRepository: ReminderRepository,
		private readonly crypter: Crypter,
	) {}

	async execute(reminder: Reminder): Promise<Reminder> {
		const newReminder: Reminder = {
			...reminder,
			id: this.crypter.randomUUID(),
		}

		newReminder.startTime = new Date(newReminder.startTime)

		newReminder.startTime.setSeconds(0)
		newReminder.startTime.setMilliseconds(0)

		return await this.reminderRepository.create(newReminder)
	}
}
