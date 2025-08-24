export interface Token {
	generate(payload: object, expiresIn?: string): string
	verify<T = any>(token: string): T
}