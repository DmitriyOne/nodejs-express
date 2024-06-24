import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { IMiddleware } from '../types/global.types';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const jwt = req.headers.authorization.split(' ')[1];
			verify(jwt, this.secret, (err, payload) => {
				if (err) {
					return next();
				}

				const typedPayload = payload as unknown as { email: string; iat: string };

				req.user = typedPayload.email as string;
				next();
			});
		} else {
			next();
		}
	}
}
