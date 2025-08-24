import { Hasher } from '../../domain/services/Hasher'
import bcrypt from 'bcrypt'

export class HasherAdapter implements Hasher {
	async hash(password: string, step: number = 10): Promise<string> {
		return bcrypt.hash(password, step)
	}

	async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
		return bcrypt.compare(data, encrypted)
	}
}
