import { Token } from 'domain/services/Token'
import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { Hasher } from '../../../domain/services/Hashser'
import { ChangePasswordType } from '../../../shared/types/Forms'

export class ChangePasswordUseCase {
	constructor(
		private readonly userReporsitory: UserRepository,
		private readonly token: Token,
		private readonly hasher: Hasher,
	) {}

	async execute(data: ChangePasswordType) {
		if (data.newPassword !== data.confirmNewPassword)
			throw new Error("Password and its confirmation don't match")

		if (data.validationToken) {
			try {
				this.token.verify(data.validationToken)
			} catch {
				throw new Error('Invalid token!')
			}
		}

		const user = await this.userReporsitory.findById(data.userId)

		if (!user) throw new Error('User not found')

		const hashedPassword = await this.hasher.hash(data.newPassword)

		return await this.userReporsitory.update({
			...user,
			password: hashedPassword,
		})
	}
}
