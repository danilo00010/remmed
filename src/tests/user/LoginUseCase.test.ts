import { beforeEach, describe, expect, it } from 'vitest'
import {
	CreateUserUseCase,
	LoginUseCase,
	ValidateTokenUseCase,
} from '../../application/usecases/User'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import { HasherAdapter, TokenAdapter } from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let createUserUseCase: CreateUserUseCase
let validateTokenUseCase: ValidateTokenUseCase
let loginUseCase: LoginUseCase

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const hasher = new HasherAdapter()
	const token = new TokenAdapter('testing')
	const mailer = new FakeMailerAdapter()

	createUserUseCase = new CreateUserUseCase(repo, hasher, token, mailer)
	validateTokenUseCase = new ValidateTokenUseCase(repo, token)
	loginUseCase = new LoginUseCase(repo, hasher, token)
})

describe('LoginUseCase', () => {
	it('should login user', async () => {
		const user = await createUserUseCase.execute({
			name: 'Isabela',
			email: 'isabela@email.com',
			password: 'password123',
		})

		await validateTokenUseCase.execute(user.verificationToken as string)

		const login = await loginUseCase.execute('isabela@email.com', 'password123')

		expect(login).toHaveProperty('accessToken')
	})

	it('should NOT login nonexistent user', async () => {
		await expect(
			loginUseCase.execute('isabela@email.com', 'password123'),
		).rejects.toThrow('User not found!')
	})

	it('should NOT login unconfirmed user', async () => {
		await createUserUseCase.execute({
			name: 'Isabela',
			email: 'isabela@email.com',
			password: 'password123',
		})

		await expect(
			loginUseCase.execute('isabela@email.com', 'password123'),
		).rejects.toThrow('User must be confirmed!')
	})

	it('should NOT login with invalid password', async () => {
		const user = await createUserUseCase.execute({
			name: 'Isabela',
			email: 'isabela@email.com',
			password: 'password123',
		})

		await validateTokenUseCase.execute(user.verificationToken as string)

		await expect(
			loginUseCase.execute('isabela@email.com', '789password'),
		).rejects.toThrow('Invalid password!')
	})
})
