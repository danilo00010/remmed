import { LogoutUseCase } from '@user/'

export class LogoutController {
	constructor(private readonly usecase: LogoutUseCase) {}

	async handle(bearerToken: string) {
		try {
			const token = bearerToken.replace('Bearer ', '')

			await this.usecase.execute(token)

			return { status: 204 }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
