import { User } from 'domain/entities/User'
import { UserRepository } from 'domain/repositories/UserRepository'

export class InMemoryUserRepository implements UserRepository {
	private users: User[] = []

	async create(user: User): Promise<User> {
		this.users.push(user)

		return {
			...user,
			password: undefined,
		}
	}

	async findById(userId: string): Promise<User | null> {
		return this.users.find(u => u.id === userId) || null
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.users.find(u => u.email === email) || null
	}

	async findByVerificationToken(token: string): Promise<User | null> {
		return this.users.find(u => u.verificationToken === token) || null
	}

	async update(user: User): Promise<User> {
		const userIndex = this.users.findIndex(u => u.id === user.id)

		this.users[userIndex] = user

		return this.users[userIndex]
	}

	async delete(userId: string): Promise<null> {
		this.users = this.users.filter(u => u.id !== userId)

		return null
	}
}
