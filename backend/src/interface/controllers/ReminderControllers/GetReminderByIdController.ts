import { GetReminderByIdUseCase } from '@reminder/'

export class GetReminderByIdController {
	constructor(private readonly usecase: GetReminderByIdUseCase) {}

	async handle(reminderId: string, userId: string) {
		try {
			const reminder = await this.usecase.execute(reminderId, userId)

			return { status: 200, body: reminder }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
