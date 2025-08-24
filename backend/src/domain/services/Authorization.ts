import { UnauthorizedError } from 'domain/errors/UnauthorizedError'

export class Authorization {
	static assertOwnership(
		resourceOwnerId: string,
		requestingUserId: string,
		resourceName = 'resource',
	) {
		if (resourceOwnerId !== requestingUserId) {
			throw new UnauthorizedError(
				`${resourceName} does not belong to this user`,
			)
		}
	}
}
