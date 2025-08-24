import { PasswordRecoveryUseCase } from '@user/'

export class PasswordRecoveryController {
	constructor(private readonly usecase: PasswordRecoveryUseCase) {}

	async handle(email: string) {
		try {
			await this.usecase.execute(email)

			return { status: 200, body: { message: 'Recovery email sent' } }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
