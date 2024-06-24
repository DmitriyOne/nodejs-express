import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { HttpErrors } from '../errors/http-errors.class';
import { IMiddleware } from '../types/global.types';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const myClass = plainToClass(this.classToValidate, body);

		validate(myClass).then((errors) => {
			if (errors && errors.length > 0) {
				const validateErrors = errors.map((e) => e.constraints).flat();
				res.status(422).send(validateErrors);
			} else {
				next();
			}
		});
	}
}
