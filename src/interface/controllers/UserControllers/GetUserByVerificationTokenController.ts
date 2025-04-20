import { GetUserByVerificationTokenUseCase } from "@user/";

export class GetUserByVerificationTokenController {
	constructor(private readonly usecase: GetUserByVerificationTokenUseCase) {}

	async handle(token: string): Promise<{ status: number; body?: any }>  {
		try {
			const { userId } = await this.usecase.execute(token)
			
			return { status: 200, body: { userId } }
		} catch (e: any) {
			return { status: 500, body: { error: e.message } }
		}
	}
}