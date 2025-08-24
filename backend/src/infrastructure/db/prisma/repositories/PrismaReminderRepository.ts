import { Reminder } from 'domain/entities/Reminder'
import { ReminderRepository } from 'domain/repositories/ReminderRepository'
import { prisma } from '../client'

export class PrismaReminderRepository implements ReminderRepository {
	async create(reminder: Reminder): Promise<Reminder> {
		return await prisma.reminder.create({
			data: {
				id: reminder.id,
				userId: reminder.userId,
				name: reminder.name,
				status: true,
				startTime: reminder.startTime,
				interval: reminder.interval
			},
		})
	}

	async findById(reminderId: string): Promise<Reminder | null> {
		return await prisma.reminder.findFirst({
			where: {
				id: reminderId,
				deletedAt: null,
			},
		})
	}

	async findByUserId(userId: string): Promise<Reminder[] | null> {
		return await prisma.reminder.findMany({
			orderBy: [
				{ status: 'desc' },
				{ name: 'asc' }
			],
			where: {
				userId,
				deletedAt: null,
				archivedAt: null,
			},
		})
	}

	async findArchiveds(userId: string): Promise<Reminder[] | null> {
		return await prisma.reminder.findMany({
			orderBy: {
				name: 'asc',
			},
			where: {
				userId,
				archivedAt: {
					not: null,
				},
			},
		})
	}

	async update(reminder: Reminder): Promise<Reminder> {
		return await prisma.reminder.update({
			where: {
				id: reminder.id,
			},
			data: {
				name: reminder.name,
				startTime: reminder.startTime,
				interval: reminder.interval,
				status: reminder.status,
				archivedAt: reminder.archivedAt,
			},
		})
	}

	async delete(reminderId: string): Promise<null> {
		await prisma.reminder.update({
			where: {
				id: reminderId,
			},
			data: {
				deletedAt: new Date(),
			},
		})

		return null
	}
}
