import { User } from 'domain/entities/User'
import { CreateUserSchema } from '../../schemas/UserSchema'
import { CreateUserUseCase } from '@user/'

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
			return { status: e.status ?? 500, body: { error: e.message } }
		}
	}
}
