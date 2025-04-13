import { User } from '../../../../domain/entities/User'
import { UserRepository } from '../../../../domain/repositories/UserRepository'
import { prisma } from '../client'

export class PrismaUserRepository implements UserRepository {
	async create(user: User): Promise<User> {
		const newUser = await prisma.user.create({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				password: user.password,
				verificationToken: user.verificationToken,
				verificationTokenExpiresAt: user.verificationTokenExpiresAt,
			},
		})

		return {
			...newUser,
			password: undefined,
		}
	}

	async findById(userId: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: {
				id: userId,
				deletedAt: null,
			},
		})
	}

	async findByEmail(email: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: {
				email,
				deletedAt: null,
			},
		})
	}

	async findByVerificationToken(token: string): Promise<User | null> {
		return await prisma.user.findFirst({
			where: {
				verificationToken: token,
				deletedAt: null,
			},
		})
	}

	async update(user: Partial<User>): Promise<User> {
		return await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				password: user.password,
				emailVerifiedAt: user.emailVerifiedAt,
				verificationToken: user.verificationToken,
				verificationTokenExpiresAt: user.verificationTokenExpiresAt,
			},
		})
	}

	async delete(userId: string): Promise<null> {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				deletedAt: new Date(),
			},
		})

		return null
	}
}
