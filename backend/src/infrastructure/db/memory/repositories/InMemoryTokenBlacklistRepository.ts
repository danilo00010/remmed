import { TokenBlacklist } from 'domain/entities/TokenBlacklist'
import { TokenBlacklistRepository } from 'domain/repositories/TokenBlacklistRepository'

export class InMemoryTokenBlacklistRepository
	implements TokenBlacklistRepository
{
	private blacklist: TokenBlacklist[] = []

	async create(token: string): Promise<void> {
		this.blacklist.push({
			token,
			blacklistedAt: new Date(),
		})
	}

	async findByToken(token: string): Promise<Partial<TokenBlacklist> | null> {
		return this.blacklist.find(listItem => listItem.token === token) || null
	}
}
