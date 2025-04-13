import { UserRepository } from '../../../domain/repositories/UserRepository'

export class DeleteUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userId: string, loggedUserId: string): Promise<null> {
		const user = await this.userRepository.findById(userId)

		if (!user) throw new Error('User not found!')

		const isSameUser = user.id === loggedUserId

		if (!isSameUser) throw new Error('Is not the same user!')

		return await this.userRepository.delete(userId)
	}
}
