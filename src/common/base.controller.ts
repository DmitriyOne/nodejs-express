import 'reflect-metadata';

import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { ILogger } from '../logger/logger.interface';
import { IControllerRoute, TExpressReturn } from '../types/global.types';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, msg: T): TExpressReturn {
		res.type('application/json');
		return res.status(code).json(msg);
	}

	public ok<T>(res: Response, msg: T): TExpressReturn {
		return this.send<T>(res, 200, msg);
	}

	public created(res: Response): TExpressReturn {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			// Logger
			this.logger.log(`[${route.method}] ${route.path}`);

			const middleware = route.middleware?.map((m) => m.execute.bind(m));
			const handler = route.cb.bind(this);

			const result = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, result);
		}
	}
}
