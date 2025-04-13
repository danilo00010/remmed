import { CreateUserSchema } from '../../schemas/UserSchema'
import { CreateUserUseCase } from '@user/'
import { User } from '../../../domain/entities/User'

export class CreateUserController {
	constructor(private readonly usecase: CreateUserUseCase) {}

	async handle(user: User) {
		const parsed = CreateUserSchema.safeParse(user)

		if (!parsed.success) {
			return { status: 400, body: parsed.error.format() }
		}

		try {
			await this.usecase.execute({
				name: user.name,
				email: user.email,
				password: user.password,
			})

			return { status: 201 }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
