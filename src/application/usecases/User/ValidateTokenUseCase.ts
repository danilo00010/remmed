import { UserRepository } from '../../../domain/repositories/UserRepository'
import { Hasher } from '../../../domain/services/Hashser'
import { Token } from '../../../domain/services/Token'

export class ValidateTokenUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly token: Token,
	) {}

	async execute(token: string): Promise<{ accessToken: string }> {
		if (!token) throw new Error('Token is required!')

		const user = await this.userRepository.findByVerificationToken(token)

		if (!user) throw new Error('Invalid token!')

		await this.userRepository.update({
			...user,
			id: user.id,
			emailVerifiedAt: new Date(),
			verificationToken: null,
			verificationTokenExpiresAt: null,
		})

		const accessToken = this.token.generate({
			userId: user.id,
			type: 'access',
		})

		return {
			accessToken,
		}
	}
}
