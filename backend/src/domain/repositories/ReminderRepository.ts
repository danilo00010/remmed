import { Reminder } from '../entities/Reminder'

export interface ReminderRepository {
	create(reminder: Reminder): Promise<Reminder>
	findById(reminderId: string): Promise<Reminder | null>
	findByUserId(userId: string): Promise<Reminder[] | null>
	findArchiveds(userId: string): Promise<Reminder[] | null>
	update(reminder: Partial<Reminder>): Promise<Reminder>
	delete(reminderId: string): Promise<null>
}
