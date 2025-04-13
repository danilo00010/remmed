export interface Hasher {
	hash(password: string, step?: number): Promise<string>
	compare(data: string | Buffer, encrypted: string): Promise<boolean>
}
