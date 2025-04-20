import { BaseError } from './BaseError'

export class ConflictError extends BaseError {
	constructor(message = 'Conflict') {
		super(message, 409)
	}
}
