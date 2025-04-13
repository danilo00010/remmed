import {
	ChangePasswordUseCase,
	CreateUserUseCase,
} from '../../application/usecases/User'
import { InMemoryUserRepository } from '../../infrastructure/db/memory/repositories'
import { HasherAdapter, TokenAdapter } from '../../infrastructure/security'
import { beforeEach, describe, expect, it } from 'vitest'
import { User } from '@prisma/client'
import { FakeMailerAdapter } from './mocks/FakeMailerAdapter'

let changePasswordUseCase: ChangePasswordUseCase
let createUserUseCase: CreateUserUseCase

const token = new TokenAdapter('testing')

beforeEach(() => {
	const repo = new InMemoryUserRepository()
	const hasher = new HasherAdapter()
	const mailer = new FakeMailerAdapter()

	createUserUseCase = new CreateUserUseCase(repo, hasher, token, mailer)
	changePasswordUseCase = new ChangePasswordUseCase(repo, token, hasher)
})

describe('ChangePasswordUseCase', () => {
	it('should change user password', async () => {
		const user = await createUserUseCase.execute({
			name: 'Edward',
			email: 'edward@email.com',
			password: 'password123',
		})

		await expect(
			changePasswordUseCase.execute({
				userId: user.id as string,
				newPassword: 'password456',
				confirmNewPassword: 'password456',
			}),
		).resolves.toHaveProperty('id')
	})

	it('should change user password with verification token', async () => {
		const user = await createUserUseCase.execute({
			name: 'Edward',
			email: 'edward@email.com',
			password: 'password123',
		})

		const validationToken = token.generate({ userId: user.id }, '30m')

		await expect(
			changePasswordUseCase.execute({
				userId: user.id as string,
				newPassword: 'password456',
				confirmNewPassword: 'password456',
				validationToken,
			}),
		).resolves.toHaveProperty('id')
	})

	it('should NOT change user password with wrong confirmation', async () => {
		const user = await createUserUseCase.execute({
			name: 'Jordan',
			email: 'jordan@email.com',
			password: 'password123',
		})

		await expect(
			changePasswordUseCase.execute({
				userId: user.id as string,
				newPassword: 'password456',
				confirmNewPassword: 'password789',
			}),
		).rejects.toThrow("Password and its confirmation don't match")
	})

	it('should NOT change user password with invalid verification token', async () => {
		await expect(
			changePasswordUseCase.execute({
				userId: 'some-id',
				newPassword: 'password123',
				confirmNewPassword: 'password123',
				validationToken: 'test',
			}),
		).rejects.toThrow('Invalid token!')
	})

	it('should NOT change user password for nonexistent user', async () => {
		await expect(
			changePasswordUseCase.execute({
				userId: 'some-id',
				newPassword: 'password123',
				confirmNewPassword: 'password123',
			}),
		).rejects.toThrow('User not found')
	})
})
