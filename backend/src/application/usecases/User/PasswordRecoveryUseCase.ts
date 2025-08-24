import { Token } from 'domain/services/Token'
import { UserRepository } from 'domain/repositories/UserRepository'
import { Mailer } from 'domain/services/Mailer'

export class PasswordRecoveryUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly token: Token,
		private readonly mailer: Mailer,
	) {}

	async execute(email: string): Promise<void> {
		if (!email) throw new Error('Email not provided!')

		const user = await this.userRepository.findByEmail(email)

		if (!user) throw new Error('User not found!')

		const APP_URL = process.env.APP_URL

		const token = this.token.generate({ userId: user.id }, '30m')

		const messageBody = `<p>To recover your password, click <a href="${APP_URL}/change-password?token=${token}">here</a>.</p>`

		await this.userRepository.update({
			...user,
			verificationToken: token,
			verificationTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
		})

		await this.mailer.sendEmail(user.email, 'Password recovery', messageBody)
	}
}
