import { LoginUseCase } from '@user/'

export class LoginController {
	constructor(private readonly usecase: LoginUseCase) {}

	async handle(email: string, password: string) {
		try {
			const { accessToken } = await this.usecase.execute(email, password)

			return { status: 200, body: { accessToken } }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
