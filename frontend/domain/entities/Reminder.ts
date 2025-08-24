export interface Reminder {
	id: string
	name: string
	status: boolean
	startTime: Date
	interval: number
	archivedAt?: Date
}
