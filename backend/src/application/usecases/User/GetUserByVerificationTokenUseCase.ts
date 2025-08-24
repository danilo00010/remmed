import { User } from 'domain/entities/User'
import { UserRepository } from 'domain/repositories/UserRepository'

export class GetUserByVerificationTokenUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(token: string): Promise<{ userId: any }> {
		if (!token) throw new Error('Token is required!')

		const user = await this.userRepository.findByVerificationToken(token)

		if (!user) throw new Error('Invalid token!')

		return {
			userId: user.id,
		}
	}
}
