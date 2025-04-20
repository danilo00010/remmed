import { NotFoundError } from '@errors/'
import { Hasher } from 'domain/services/Hasher'
import { User } from 'domain/entities/User'
import { UserRepository } from 'domain/repositories/UserRepository'

export class UpdateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	async execute(newUserData: Partial<User>): Promise<User> {
		const user = await this.userRepository.findById(newUserData.id as string)

		if (!user) throw new NotFoundError('User not found!')

		const hashedPassword = newUserData.password
			? await this.hasher.hash(newUserData.password)
			: user.password

		return await this.userRepository.update({
			...newUserData,
			password: hashedPassword,
		})
	}
}
