import { beforeEach, describe, it } from 'vitest'
import { expect } from 'vitest'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'
import { HasherAdapter } from '../../infrastructure/security/HasherAdapter'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import { TokenAdapter } from '../../infrastructure/security/TokenAdapter'
import {
	UpdateUserUseCase,
	CreateUserUseCase,
} from '../../application/usecases/User'
import { User } from '../../domain/entities/User'

let createUseCase: CreateUserUseCase
let updateUseCase: UpdateUserUseCase

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const token = new TokenAdapter('testing')
	const hasher = new HasherAdapter()
	const mailer = new FakeMailerAdapter()

	createUseCase = new CreateUserUseCase(repo, hasher, token, mailer)
	updateUseCase = new UpdateUserUseCase(repo, hasher)
})

describe('UpdateUserUseCase', () => {
	it('should update user data', async () => {
		let user: User

		user = await createUseCase.execute({
			name: 'John',
			email: 'john@email.com',
			password: 'password123',
		})

		const userId = user.id

		user = await updateUseCase.execute({
			id: userId,
			name: 'Michelle',
			email: 'michelle@email.com',
		})

		expect(user.name).toBe('Michelle')
		expect(user.email).toBe('michelle@email.com')
	})

	it('should NOT update user data if user does not exist', async () => {
		await expect(
			updateUseCase.execute({
				id: 'some-id',
				name: 'John',
				email: 'john@email.com',
			}),
		).rejects.toThrow('User not found!')
	})
})
