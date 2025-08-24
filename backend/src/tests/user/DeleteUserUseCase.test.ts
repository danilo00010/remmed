import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import {
	CreateUserUseCase,
	DeleteUserUseCase,
} from '../../application/usecases/User'
import { UserRepository } from 'domain/repositories/UserRepository'
import {
	HasherAdapter,
	TokenAdapter,
	CrypterAdapter,
} from '../../infrastructure/security'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'
import { beforeEach, describe, expect, it } from 'vitest'

let deleteUserUseCase: DeleteUserUseCase
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
	deleteUserUseCase = new DeleteUserUseCase(repo)
})

describe('DeleteUserUseCase', () => {
	it('should delete user', async () => {
		const user = await createUserUseCase.execute({
			name: 'Julia',
			email: 'julia@email.com',
			password: 'password123',
		})

		const userToDeleteId = user.id as string
		const loggedUserId = user.id as string

		await expect(
			deleteUserUseCase.execute(userToDeleteId, loggedUserId),
		).resolves.toBeNull()
	})

	it("should NOT delete user if it's not the same", async () => {
		const user = await createUserUseCase.execute({
			name: 'Julia',
			email: 'julia@email.com',
			password: 'password123',
		})

		const userToDeleteId = user.id as string
		const loggedUserId = 'some-id'

		await expect(
			deleteUserUseCase.execute(userToDeleteId, loggedUserId),
		).rejects.toThrow('Is not the same user!')
	})

	it('should NOT delete user an nonexistent user', async () => {
		const userToDeleteId = 'some-id'
		const loggedUserId = 'some-id'

		await expect(
			deleteUserUseCase.execute(userToDeleteId, loggedUserId),
		).rejects.toThrow('User not found!')
	})
})
