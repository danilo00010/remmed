import { TokenBlacklist } from '../../../../domain/entities/TokenBlacklist'
import { TokenBlacklistRepository } from '../../../../domain/repositories/TokenBlacklistRepository'
import { prisma } from '../client'

export class PrismaTokenBlacklistRepository
	implements TokenBlacklistRepository
{
	async create(token: string): Promise<void> {
		await prisma.tokenBlacklist.create({
			data: {
				token,
			},
		})
	}

	async findByToken(token: string): Promise<Partial<TokenBlacklist> | null> {
		return await prisma.tokenBlacklist.findUnique({
			where: {
				token,
			},
		})
	}
}
