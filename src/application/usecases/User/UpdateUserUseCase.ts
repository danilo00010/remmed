import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { Hasher } from '../../../domain/services/Hashser'

export class UpdateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	async execute(newUserData: Partial<User>): Promise<User> {
		const user = await this.userRepository.findById(newUserData.id as string)

		if (!user) throw new Error('User not found!')

		const hashedPassword = newUserData.password
			? await this.hasher.hash(newUserData.password)
			: user.password

		return await this.userRepository.update({
			...newUserData,
			password: hashedPassword,
		})
	}
}
