import 'reflect-metadata';

import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { AuthGuard } from '../common/auth.guard';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { INVERSIFY_NAMES } from '../constants/inversify-names.constant';
import { ROUTES_PATH } from '../constants/routes.constant';
import { HttpErrors } from '../errors/http-errors.class';
import { ILogger } from '../logger/logger.interface';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './services/user-service.interface';
import { IUserController } from './user-controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(INVERSIFY_NAMES.Logger) private loggerService: ILogger,
		@inject(INVERSIFY_NAMES.UserService) private userService: IUserService,
		@inject(INVERSIFY_NAMES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: ROUTES_PATH.Login,
				method: 'post',
				cb: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: ROUTES_PATH.Register,
				method: 'post',
				cb: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: ROUTES_PATH.Info,
				method: 'get',
				cb: this.info,
				middleware: [new AuthGuard()],
			},
		]);
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(new HttpErrors(401, 'Нет такого пользователя!', 'login'));
		}

		const jwt = await this.singJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { success: 'Вы успешно авторизировались!', jwt });
	}

	async register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const { body } = req;

		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HttpErrors(422, 'Такой пользователь уже зарегестрирован!', 'register'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(req.user);
		this.ok(res, { id: userInfo?.id, name: userInfo?.name, email: userInfo?.email });
	}

	private singJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
