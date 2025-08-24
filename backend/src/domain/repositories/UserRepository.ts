import { User } from '../entities/User'

export interface UserRepository {
	create(user: User): Promise<User>
	findById(userId: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	findByVerificationToken(token: string): Promise<User | null>
	update(user: Partial<User>): Promise<User>
	delete(userId: string): Promise<null>
}
