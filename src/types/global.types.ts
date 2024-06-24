import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'inversify';

import { App } from '../app';

export type TExpressReturn = Response<any, Record<string, any>>;

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export interface IMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}

export interface IControllerRoute {
	path: string;
	cb: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
	middleware?: IMiddleware[];
}
