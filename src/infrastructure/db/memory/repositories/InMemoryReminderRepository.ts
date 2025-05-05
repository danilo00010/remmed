import { Reminder } from "domain/entities/Reminder";
import { ReminderRepository } from "domain/repositories/ReminderRepository";

export default class InMemoryReminderRepository implements ReminderRepository {
	create(reminder: Reminder): Promise<Reminder> {
		throw new Error("Method not implemented.");
	}
	findById(reminderId: string): Promise<Reminder | null> {
		throw new Error("Method not implemented.");
	}
	findByUserId(userId: string): Promise<Reminder[] | null> {
		throw new Error("Method not implemented.");
	}
	findArchiveds(userId: string): Promise<Reminder[] | null> {
		throw new Error("Method not implemented.");
	}
	update(reminder: Partial<Reminder>): Promise<Reminder> {
		throw new Error("Method not implemented.");
	}
	delete(reminderId: string): Promise<null> {
		throw new Error("Method not implemented.");
	}
}