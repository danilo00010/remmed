import { z } from 'zod'

export const CreateUserSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
})

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

export const ChangePasswordSchema = z.object({
	userId: z.string(),
	newPassword: z.string().min(6).max(18),
	confirmNewPassword: z.string().min(6).max(18),
})
