import { NextFunction, Request, Response } from 'express';

import { HttpErrors } from './http-errors.class';

export interface IError {
	catch: (err: Error | HttpErrors, req: Request, res: Response, next: NextFunction) => void;
}
