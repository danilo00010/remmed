import { ListAllRemindersUseCase } from '@reminder/'

export class ListAllRemindersController {
	constructor(private readonly usecase: ListAllRemindersUseCase) {}

	async handle(userId: string) {
		try {
			const reminders = await this.usecase.execute(userId)

			return {
				status: 200,
				body: reminders,
			}
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
