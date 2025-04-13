import { ChangePasswordUseCase } from '@user/'
import { ChangePasswordType } from '../../../shared/types/Forms'
import { ChangePasswordSchema } from '../../schemas/UserSchema'

export class ChangePasswordController {
	constructor(private readonly usecase: ChangePasswordUseCase) {}

	async handle(data: ChangePasswordType) {
		const parsed = ChangePasswordSchema.safeParse(data)

		if (!parsed.success) {
			return { status: 400, body: parsed.error.format() }
		}

		try {
			await this.usecase.execute(data)

			return { status: 200 }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
