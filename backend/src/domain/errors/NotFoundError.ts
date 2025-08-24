import { BaseError } from './BaseError'

export class NotFoundError extends BaseError {
	constructor(message = 'Not found') {
		super(message, 404)
	}
}
