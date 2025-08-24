export type Middleware<Req, Res> = (
	req: Req,
	res: Res,
	next: () => void,
) => void

export interface Server<Req, Res> {
	authenticate?: Middleware<Req, Res>

	get(
		uri: string,
		callback: (req: Req, res: Res) => void,
		options?: { middlewares?: Middleware<Req, Res>[] },
	): void
	post(
		uri: string,
		callback: (req: Req, res: Res) => void,
		options?: { middlewares?: Middleware<Req, Res>[] },
	): void
	put(
		uri: string,
		callback: (req: Req, res: Res) => void,
		options?: { middlewares?: Middleware<Req, Res>[] },
	): void
	patch(
		uri: string,
		callback: (req: Req, res: Res) => void,
		options?: { middlewares?: Middleware<Req, Res>[] },
	): void
	delete(
		uri: string,
		callback: (req: Req, res: Res) => void,
		options?: { middlewares?: Middleware<Req, Res>[] },
	): void
}
