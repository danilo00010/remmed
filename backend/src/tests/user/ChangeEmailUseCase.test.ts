import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	CreateUserUseCase,
	ChangeEmailUseCase,
} from '../../application/usecases/User'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import {
	CrypterAdapter,
	HasherAdapter,
	TokenAdapter,
} from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'
import { BadRequestError, ConflictError, NotFoundError } from '@errors/'

let createUserUseCase: CreateUserUseCase
let changeEmailUseCase: ChangeEmailUseCase
let mailer: FakeMailerAdapter

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const hasher = new HasherAdapter()
	const token = new TokenAdapter('testing')
	mailer = new FakeMailerAdapter()
	const crypter = new CrypterAdapter()

	createUserUseCase = new CreateUserUseCase(
		repo,
		hasher,
		token,
		mailer,
		crypter,
	)
	changeEmailUseCase = new ChangeEmailUseCase(repo, token, mailer)
})

describe('ChangeEmailUseCase', () => {
	it('should send verification email if new email is valid', async () => {
		const user = await createUserUseCase.execute({
			name: 'Maria',
			email: 'maria@email.com',
			password: 'password123',
		})

		const sendEmailSpy = vi.spyOn(mailer, 'sendEmail')

		await expect(
			changeEmailUseCase.execute('new@email.com', user.id as string),
		).resolves.toBeUndefined()

		expect(sendEmailSpy).toHaveBeenCalledWith(
			'new@email.com',
			'Validate new e-mail',
			expect.stringContaining('/validate-token?token='),
		)
	})

	it('should throw NotFoundError if user does not exist', async () => {
		await expect(
			changeEmailUseCase.execute('new@email.com', 'non-existent-id'),
		).rejects.toThrow(NotFoundError)
	})

	it('should throw BadRequestError if new email is the same as current', async () => {
		const user = await createUserUseCase.execute({
			name: 'Lucas',
			email: 'lucas@email.com',
			password: 'password123',
		})

		await expect(
			changeEmailUseCase.execute('lucas@email.com', user.id as string),
		).rejects.toThrow(BadRequestError)
	})

	it('should throw ConflictError if new email is already in use', async () => {
		await createUserUseCase.execute({
			name: 'João',
			email: 'joao@email.com',
			password: 'password123',
		})

		const user2 = await createUserUseCase.execute({
			name: 'Pedro',
			email: 'pedro@email.com',
			password: 'password123',
		})

		await expect(
			changeEmailUseCase.execute('joao@email.com', user2.id as string),
		).rejects.toThrow(ConflictError)
	})
})
