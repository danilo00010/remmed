import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import {
	CreateUserUseCase,
	ValidateTokenUseCase,
} from '../../application/usecases/User'
import { beforeEach, describe, expect, it } from 'vitest'
import {
	CrypterAdapter,
	HasherAdapter,
	TokenAdapter,
} from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let createUserUseCase: CreateUserUseCase
let validateTokenUseCase: ValidateTokenUseCase

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const hasher = new HasherAdapter()
	const token = new TokenAdapter('testing')
	const mailer = new FakeMailerAdapter()
	const crypter = new CrypterAdapter()

	createUserUseCase = new CreateUserUseCase(
		repo,
		hasher,
		token,
		mailer,
		crypter,
	)
	validateTokenUseCase = new ValidateTokenUseCase(repo, token)
})

describe('ValidateTokenUseCase', () => {
	it('should validate token', async () => {
		const user = await createUserUseCase.execute({
			name: 'George',
			email: 'george@email.com',
			password: 'password123',
		})

		const validation = await validateTokenUseCase.execute(
			user.verificationToken as string,
		)

		expect(validation).toHaveProperty('accessToken')
	})

	it('should NOT validate token if no token is provided', async () => {
		await expect(
			validateTokenUseCase.execute(undefined as unknown as string),
		).rejects.toThrow('Token is required!')
	})

	it('should NOT validate if is invalid token', async () => {
		await expect(validateTokenUseCase.execute('some-token')).rejects.toThrow(
			'Invalid token!',
		)
	})
})
