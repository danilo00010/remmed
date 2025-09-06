import { beforeEach, describe, expect, it } from 'vitest'
import {
	CreateUserUseCase,
	GetUserByVerificationTokenUseCase,
} from '../../application/usecases/User'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import {
	CrypterAdapter,
	HasherAdapter,
	TokenAdapter,
} from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let getUserByVerificationTokenUseCase: GetUserByVerificationTokenUseCase
let createUserUseCase: CreateUserUseCase

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
	getUserByVerificationTokenUseCase = new GetUserByVerificationTokenUseCase(
		repo,
	)
})

describe('GetUserByVerificationTokenUseCase', () => {
	it('should return userId if token is valid', async () => {
		const user = await createUserUseCase.execute({
			name: 'Top',
			email: 'tom@email.com',
			password: 'password123',
		})

		const verificationToken = user.verificationToken as string

		const result =
			await getUserByVerificationTokenUseCase.execute(verificationToken)

		expect(result).toEqual({ userId: user.id })
	})

	it('should throw error if token is missing', async () => {
		await expect(getUserByVerificationTokenUseCase.execute('')).rejects.toThrow(
			'Token is required!',
		)
	})

	it('should throw error if token is invalid', async () => {
		await expect(
			getUserByVerificationTokenUseCase.execute('wrong-token'),
		).rejects.toThrow('Invalid token!')
	})
})
