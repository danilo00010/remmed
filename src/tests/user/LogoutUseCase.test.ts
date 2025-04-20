import { beforeEach, describe, expect, it } from 'vitest'
import {
	CreateUserUseCase,
	LoginUseCase,
	LogoutUseCase,
	ValidateTokenUseCase,
} from '../../application/usecases/User'
import {
	InMemoryUserRepository,
	InMemoryTokenBlacklistRepository,
} from '../../infrastructure/db/memory/repositories'
import {
	HasherAdapter,
	TokenAdapter,
	CrypterAdapter,
} from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let createUserUseCase: CreateUserUseCase
let validateTokenUseCase: ValidateTokenUseCase
let loginUseCase: LoginUseCase
let logoutUseCase: LogoutUseCase

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const tokenRepo = new InMemoryTokenBlacklistRepository()
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
	loginUseCase = new LoginUseCase(repo, hasher, token)
	logoutUseCase = new LogoutUseCase(tokenRepo)
})

describe('LogoutUseCase', () => {
	it('should logout user and blacklist token', async () => {
		const user = await createUserUseCase.execute({
			name: 'Brendon',
			email: 'brendon@email.com',
			password: 'password123',
		})

		await validateTokenUseCase.execute(user.verificationToken as string)

		const { accessToken } = await loginUseCase.execute(
			'brendon@email.com',
			'password123',
		)

		await expect(logoutUseCase.execute(accessToken)).resolves.toBeUndefined()
	})

	it('should NOT logout if access token not provided', async () => {
		await expect(
			logoutUseCase.execute(undefined as unknown as string),
		).rejects.toThrow('Access token not provided')
	})
})
