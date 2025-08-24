import { ReminderSchema } from 'interface/schemas/ReminderSchema'
import { Reminder } from 'domain/entities/Reminder'
import { UpdateReminderUseCase } from '@reminder/'

export class UpdateReminderController {
	constructor(private readonly usecase: UpdateReminderUseCase) {}

	async handle(reminder: Reminder) {
		const parsed = ReminderSchema.safeParse(reminder)

		if (!parsed.success) {
			const errors = parsed.error.errors.map(err => ({
				path: err.path.join('.'),
				message: err.message,
			}))

			return { status: 400, body: { errors } }
		}

		try {
			await this.usecase.execute(reminder)

			return { status: 200 }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
