import { CreateReminderUseCase } from '@reminder/'
import { Reminder } from 'domain/entities/Reminder'
import { ReminderSchema } from '../../schemas/ReminderSchema'

export class CreateReminderController {
	constructor(private readonly usecase: CreateReminderUseCase) {}

	async handle(reminder: Reminder) {
		const parsed = ReminderSchema.safeParse(reminder)

		if (!parsed.success) {
			const errors = parsed.error.errors.map(err => ({
				path: err.path.join('.'),
				message: err.message,
			}))

			console.error(errors)

			return { status: 400, body: { errors } }
		}

		try {
			await this.usecase.execute(reminder)

			return { status: 201 }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
