import { BadRequestError, ConflictError, NotFoundError } from '@errors/'
import { UserRepository } from 'domain/repositories/UserRepository'
import { Mailer } from 'domain/services/Mailer'
import { Token } from 'domain/services/Token'

export class ChangeEmailUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly token: Token,
		private readonly mailer: Mailer,
	) {}

	async execute(newEmail: string, userId: string): Promise<void> {
		const user = await this.userRepository.findById(userId)

		if (!user) throw new NotFoundError('User not found!')

		if (user.email === newEmail)
			throw new BadRequestError('E-mail is not different!')

		const hasUser = await this.userRepository.findByEmail(newEmail)

		if (hasUser) throw new ConflictError('Email already in use!')

		const APP_URL = process.env.APP_URL

		const verificationToken = this.token.generate(
			{ userId: user.id, type: 'verification', tempEmail: newEmail },
			'1h',
		)

		await this.userRepository.update({
			...user,
			verificationToken,
		})

		const messageBody = `<p>Validaet your new e-mail by clicking <a href="${APP_URL}/validate-token?token=${verificationToken}">here</a></p>`

		await this.mailer.sendEmail(newEmail, 'Validate new e-mail', messageBody)
	}
}
