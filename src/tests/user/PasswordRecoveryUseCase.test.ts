import { beforeEach, describe, expect, it } from 'vitest'
import {
	CreateUserUseCase,
	PasswordRecoveryUseCase,
} from '../../application/usecases/User'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import { HasherAdapter, TokenAdapter } from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let createUserUseCase: CreateUserUseCase
let passwordRecoveryUseCase: PasswordRecoveryUseCase

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const hasher = new HasherAdapter()
	const token = new TokenAdapter('testing')
	const mailer = new FakeMailerAdapter()

	createUserUseCase = new CreateUserUseCase(repo, hasher, token, mailer)
	passwordRecoveryUseCase = new PasswordRecoveryUseCase(repo, token, mailer)
})

describe('PasswordRecoveryUseCase', () => {
	it('should recovery password (send email)', async () => {
		const user = await createUserUseCase.execute({
			name: 'Patrick',
			email: 'patrick@email.com',
			password: 'password123',
		})

		await expect(
			passwordRecoveryUseCase.execute(user.email),
		).resolves.toBeUndefined()
	})

	it('should NOT recover password if no email is provided', async () => {
		await expect(
			passwordRecoveryUseCase.execute(undefined as unknown as string),
		).rejects.toThrow('Email not provided!')
	})

	it('should NOT recover password for an nonexistent user', async () => {
		await expect(passwordRecoveryUseCase.execute('some-email')).rejects.toThrow(
			'User not found!',
		)
	})
})
