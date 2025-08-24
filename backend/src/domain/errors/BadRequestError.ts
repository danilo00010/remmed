import { BaseError } from './BaseError'

export class BadRequestError extends BaseError {
	constructor(message = 'Conflict') {
		super(message, 400)
	}
}
