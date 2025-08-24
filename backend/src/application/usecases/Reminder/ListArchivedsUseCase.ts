import { ReminderRepository } from 'domain/repositories/ReminderRepository'

export class ListArchivedsUseCase {
	constructor(private readonly reminderRepository: ReminderRepository) {}

	async execute(userId: string) {
		return await this.reminderRepository.findArchiveds(userId)
	}
}
