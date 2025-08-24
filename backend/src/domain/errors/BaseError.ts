export abstract class BaseError extends Error {
	constructor(
		message: string,
		public readonly statusCode = 400,
	) {
		super(message)
		this.name = new.target.name
	}
}
