import { ValidateTokenUseCase } from '@user/'

export class ValidateTokenController {
	constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

	async handle(token: string): Promise<{ status: number; body?: any }> {
		try {
			const response = await this.validateTokenUseCase.execute(token)

			return { status: 200, body: { ...response } }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}
