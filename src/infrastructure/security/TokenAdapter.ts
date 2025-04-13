import { Token } from '../../domain/services/Token'
import jwt, { SignOptions } from 'jsonwebtoken'

export class TokenAdapter implements Token {
	private secret: string

	constructor(
		secret?: string,
		private readonly defaultExpiresIn: string = '30d',
	) {
		this.secret = secret ?? process.env.JWT_SECRET ?? ''

		if (!this.secret) {
			throw new Error('JWT secret must be defined!')
		}
	}

	generate(payload: object, expiresIn?: string): string {
		const options: SignOptions = {
			expiresIn: (expiresIn ||
				this.defaultExpiresIn) as SignOptions['expiresIn'],
		}

		return jwt.sign(payload, this.secret, options)
	}

	verify<T = any>(token: string): T {
		return jwt.verify(token, this.secret) as T
	}
}
