import { TokenBlacklist } from '../entities/TokenBlacklist'

export interface TokenBlacklistRepository {
	create(token: string): Promise<void>
	findByToken(token: string): Promise<Partial<TokenBlacklist> | null>
}
