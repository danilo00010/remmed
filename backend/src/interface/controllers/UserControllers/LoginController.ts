import { LoginUseCase } from '@user/'

export class LoginController {
	constructor(private readonly usecase: LoginUseCase) {}

	async handle(email: string, password: string) {
		try {
			const responseData = await this.usecase.execute(email, password)

			return { status: 200, body: responseData }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
