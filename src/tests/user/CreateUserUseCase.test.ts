import { describe, it, expect, beforeEach } from 'vitest'
import { CreateUserUseCase } from '../../application/usecases/User'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import {
	HasherAdapter,
	TokenAdapter,
	CrypterAdapter,
} from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let usecase: CreateUserUseCase

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const hasher = new HasherAdapter()
	const token = new TokenAdapter('testing')
	const mailer = new FakeMailerAdapter()
	const crypter = new CrypterAdapter()

	usecase = new CreateUserUseCase(repo, hasher, token, mailer, crypter)
})

describe('CreateUserUseCase', () => {
	it('should create a new user', async () => {
		const user = await usecase.execute({
			name: 'Alice',
			email: 'alice@email.com',
			password: 'password123',
		})
		expect(user).toHaveProperty('id')
		expect(user.name).toBe('Alice')
	})

	it('should not allow duplicate emails', async () => {
		await usecase.execute({
			name: 'Alice',
			email: 'alice@email.com',
			password: 'password123',
		})

		await expect(
			usecase.execute({
				name: 'Alice',
				email: 'alice@email.com',
				password: 'password123',
			}),
		).rejects.toThrow('User already exists')
	})
})
