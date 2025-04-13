import { TokenBlacklistRepository } from '../../../domain/repositories/TokenBlacklistRepository'

export class IsBlackListedUseCase {
	constructor(private readonly tokenRepository: TokenBlacklistRepository) {}

	async execute(bearerToken: string) {
		const token = bearerToken.replace('Bearer ', '')

		return !!(await this.tokenRepository.findByToken(token))
	}
}
