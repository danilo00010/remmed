import { ReadReminderUseCase } from '@reminder/'

export class ReadReminderController {
	constructor(private readonly usecase: ReadReminderUseCase) {}

	async handle(reminderId: string, userId: string) {
		try {
			const reminder = await this.usecase.execute(reminderId, userId)

			return { status: 200, body: reminder }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
