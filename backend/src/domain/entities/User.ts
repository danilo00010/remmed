export interface User {
	id?: string
	name: string
	email: string
	password?: string | null | undefined
	emailVerifiedAt?: Date | null
	verificationToken?: string | null
	verificationTokenExpiresAt?: Date | null
	createdAt?: Date | null
	updatedAt?: Date | null
	deletedAt?: Date | null
}
