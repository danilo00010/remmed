import { User } from 'domain/entities/User'
import { UserRepository } from 'domain/repositories/UserRepository'
import { Token } from 'domain/services/Token'

export class ValidateTokenUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly token: Token,
	) {}

	async execute(
		token: string,
	): Promise<{ accessToken?: string; newEmail?: string }> {
		if (!token) throw new Error('Token is required!')

		const user = await this.userRepository.findByVerificationToken(token)

		if (!user) throw new Error('Invalid token!')

		const decryptedToken = this.token.verify(token)

		if (decryptedToken.tempEmail) {
			await this.ClearUserVerificationToken(user)

			return {
				newEmail: decryptedToken.tempEmail,
			}
		}

		await this.ClearUserVerificationToken(user)

		const accessToken = this.token.generate({
			userId: user.id,
			type: 'access',
		})

		return {
			accessToken,
		}
	}

	private async ClearUserVerificationToken(user: User) {
		await this.userRepository.update({
			...user,
			id: user.id,
			emailVerifiedAt: new Date(),
			verificationToken: null,
			verificationTokenExpiresAt: null,
		})
	}
}
