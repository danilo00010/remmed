import { Reminder } from 'domain/entities/Reminder'
import { ReminderRepository } from 'domain/repositories/ReminderRepository'

export class InMemoryReminderRepository implements ReminderRepository {
	private reminders: Reminder[] = []

	async create(reminder: Reminder): Promise<Reminder> {
		this.reminders.push(reminder)
		return reminder
	}

	async findById(reminderId: string): Promise<Reminder | null> {
		const reminder = this.reminders.find(r => r.id === reminderId)
		return reminder ?? null
	}

	async findByUserId(userId: string): Promise<Reminder[] | null> {
		const userReminders = this.reminders.filter(r => r.userId === userId)
		return userReminders.length > 0 ? userReminders : null
	}

	async findArchiveds(userId: string): Promise<Reminder[] | null> {
		const archived = this.reminders.filter(
			r => r.userId === userId && r.archive === true,
		)
		return archived.length > 0 ? archived : null
	}

	async update(reminder: Partial<Reminder>): Promise<Reminder> {
		if (!reminder.id) {
			throw new Error('Reminder ID is required to update.')
		}

		const index = this.reminders.findIndex(r => r.id === reminder.id)
		if (index === -1) {
			throw new Error('Reminder not found.')
		}

		this.reminders[index] = {
			...this.reminders[index],
			...reminder,
			updatedAt: new Date(),
		}

		return this.reminders[index]
	}

	async delete(reminderId: string): Promise<null> {
		this.reminders = this.reminders.filter(r => r.id !== reminderId)
		return null
	}
}
