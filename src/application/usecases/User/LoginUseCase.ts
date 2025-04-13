import { UserRepository } from '../../../domain/repositories/UserRepository'
import { Hasher } from '../../../domain/services/Hashser'
import { TokenAdapter } from '../../../infrastructure/security/TokenAdapter'

export class LoginUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
		private readonly token: TokenAdapter,
	) {}

	async execute(
		email: string,
		password: string,
	): Promise<{ accessToken: string }> {
		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new Error('User not found!')

		if (user.verificationToken) throw new Error('User must be confirmed!')

		const isMatch = await this.hasher.compare(password, user.password ?? '')

		if (!isMatch) throw new Error('Invalid password!')

		const accessToken = this.token.generate({ userId: user.id, type: 'access' })

		return {
			accessToken,
		}
	}
}
