import 'reflect-metadata';

import { json } from 'body-parser';
import type { Express } from 'express';
import express from 'express';
import type { Server } from 'http';
import { inject, injectable } from 'inversify';

import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';
import { INVERSIFY_NAMES } from './constants/inversify-names.constant';
import { PrismaService } from './database/prisma.service';
import { IError } from './errors/errors.interface';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/user.controller';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(INVERSIFY_NAMES.Logger) private loggerService: ILogger,
		@inject(INVERSIFY_NAMES.UserController) private userController: UserController,
		@inject(INVERSIFY_NAMES.ErrorService) private errorsService: IError,
		@inject(INVERSIFY_NAMES.PrismaService) private prismaService: PrismaService,
		@inject(INVERSIFY_NAMES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 1234;
		this.server = express().listen(8000);
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/user', this.userController.router);
	}

	useErrors(): void {
		this.app.use(this.errorsService.catch.bind(this.errorsService));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useErrors();
		this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.loggerService.log(`Сервер был запущен на http://localhost:${this.port}`);
	}
}
