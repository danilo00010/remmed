export interface Reminder {
	id?: string
	userId: string
	name?: string | null
	status?: boolean
	startTime: Date
	interval: number
	createdAt?: Date | null
	updatedAt?: Date | null
	deletedAt?: Date | null
	archivedAt?: Date | null
	archive?: boolean
}
