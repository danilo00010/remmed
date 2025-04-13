import { DeleteUserUseCase } from '@user/'

export class DeleteUserController {
	constructor(private readonly usecase: DeleteUserUseCase) {}

	async handle(userId: string, loggedUserId: string) {
		try {
			await this.usecase.execute(userId, loggedUserId)

			return { status: 204 }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
