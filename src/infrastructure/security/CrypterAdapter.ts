import { Crypter } from 'domain/services/Crypter'
import crypto from 'crypto'

export class CrypterAdapter implements Crypter {
	randomUUID(): string {
		return crypto.randomUUID()
	}
}
