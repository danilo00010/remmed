export type ChangePasswordType = {
	userId: string
	newPassword: string
	confirmNewPassword: string
	validationToken?: string
}
