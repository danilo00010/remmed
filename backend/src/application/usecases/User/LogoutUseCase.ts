import { TokenBlacklistRepository } from 'domain/repositories/TokenBlacklistRepository'

export class LogoutUseCase {
	constructor(private readonly tokenRepository: TokenBlacklistRepository) {}

	async execute(token: string) {
		if (!token) throw new Error('Access token not provided')

		await this.tokenRepository.create(token)
	}
}
