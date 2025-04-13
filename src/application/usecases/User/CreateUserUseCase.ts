import { Hasher } from '../../../domain/services/Hashser'
import { randomUUID } from 'crypto'
import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { Token } from '../../../domain/services/Token'
import { Mailer } from '../../../domain/services/Mailer'

export class CreateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
		private readonly token: Token,
		private readonly mailer: Mailer,
	) {}

	async execute(user: User): Promise<User> {
		const exists = await this.userRepository.findByEmail(user.email)

		if (exists) throw new Error('User already exists')

		const hashedPassword = await this.hasher.hash(user.password ?? '')

		const verificationToken = this.token.generate(
			{ userId: user.id, type: 'verification' },
			'1h',
		)

		const newUser: User = {
			id: randomUUID(),
			name: user.name,
			email: user.email,
			password: hashedPassword,
			verificationToken,
			verificationTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
		}

		const wasCreated = await this.userRepository.create(newUser)

		if (wasCreated) {
			const APP_URL = process.env.APP_URL

			const messageBody = `<p>Confirm your registration by clicking <a href="${APP_URL}/validate-token?token=${verificationToken}">here</a></p>`

			await this.mailer.sendEmail(
				newUser.email,
				'Confirm registration',
				messageBody,
			)
		}

		return wasCreated
	}
}
