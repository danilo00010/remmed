import { DeleteReminderUseCase } from '@reminder/'

export class DeleteReminderController {
	constructor(private readonly usecase: DeleteReminderUseCase) {}

	async handle(reminderId: string, userId: string) {
		try {
			await this.usecase.execute(reminderId, userId)

			return { status: 204 }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
