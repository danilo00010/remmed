import ChangeEmailUseCase from 'application/usecases/User/ChangeEmailUseCase'
import { ChangeEmailSchema } from 'interface/schemas/UserSchema'

export default class ChangeEmailController {
	constructor(private readonly useCase: ChangeEmailUseCase) {}

	async handle(newEmail: string, userId: string) {
		const parsed = ChangeEmailSchema.safeParse(newEmail)

		if (!parsed.success) {
			return { status: 400, body: parsed.error.format() }
		}

		try {
			await this.useCase.execute(newEmail, userId)

			return { status: 200 }
		} catch (e: any) {
			return { status: e.status ?? 500, body: { error: e.message } }
		}
	}
}
