import { CreateUserSchema } from '../../schemas/UserSchema'
import { UpdateUserUseCase } from '@user/'
import { User } from 'domain/entities/User'

export class UpdateUserController {
	constructor(private readonly usecase: UpdateUserUseCase) {}

	async handle(user: User) {
		const parsed = CreateUserSchema.safeParse(user)

		if (!parsed.success) {
			return { status: 400, body: parsed.error.format() }
		}

		try {
			const updatedUser = await this.usecase.execute(user)

			return { status: 200, body: updatedUser }
		} catch (e: any) {
			return { status: e.statusCode ?? 500, body: { error: e.message } }
		}
	}
}
