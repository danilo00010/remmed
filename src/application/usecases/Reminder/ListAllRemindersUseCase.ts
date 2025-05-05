import { ReminderRepository } from 'domain/repositories/ReminderRepository'

export class ListAllRemindersUseCase {
	constructor(private readonly reminderRepository: ReminderRepository) {}

	async execute(userId: string) {
		return await this.reminderRepository.findByUserId(userId)
	}
}
