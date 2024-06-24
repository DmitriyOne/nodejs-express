import 'reflect-metadata';

import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { INVERSIFY_NAMES } from '../constants/inversify-names.constant';
import { ILogger } from '../logger/logger.interface';

import { IError } from './errors.interface';
import { HttpErrors } from './http-errors.class';

@injectable()
export class ErrorsService implements IError {
	constructor(@inject(INVERSIFY_NAMES.Logger) private loggerService: ILogger) {}

	catch(err: Error | HttpErrors, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpErrors) {
			this.loggerService.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ error: err.message });
		} else {
			this.loggerService.error(err.message);
			res.status(500).send({ error: err.message });
		}
	}
}
