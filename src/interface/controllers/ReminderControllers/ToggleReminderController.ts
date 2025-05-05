import { ToggleReminderUseCase } from '@reminder/'

export class ToggleReminderController {
	constructor(private readonly usecase: ToggleReminderUseCase) {}

	async handle(reminderId: string, userId: string) {
		try {
			await this.usecase.execute(reminderId, userId)

			return { status: 200 }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
