import { ListArchivedsUseCase } from '@reminder/'

export class ListArchivedsController {
	constructor(private readonly usecase: ListArchivedsUseCase) {}

	async handle(userId: string) {
		try {
			const reminders = await this.usecase.execute(userId)

			return { status: 200, body: reminders }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
