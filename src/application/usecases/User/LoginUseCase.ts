import { NotFoundError, UnauthorizedError } from '@errors/'
import { UserRepository } from 'domain/repositories/UserRepository'
import { Hasher } from 'domain/services/Hasher'
import { TokenAdapter } from 'infrastructure/security/TokenAdapter'
import { User } from 'domain/entities/User'

export class LoginUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
		private readonly token: TokenAdapter,
	) {}

	async execute(
		email: string,
		password: string,
	): Promise<{ accessToken: string; user: Partial<User> }> {
		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new NotFoundError('User not found!')

		if (user.verificationToken && !user.emailVerifiedAt)
			throw new Error('User must be confirmed!')

		const isMatch = await this.hasher.compare(password, user.password ?? '')

		if (!isMatch) throw new UnauthorizedError('Invalid credentials!')

		const accessToken = this.token.generate({ userId: user.id, type: 'access' })

		return {
			accessToken,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		}
	}
}
