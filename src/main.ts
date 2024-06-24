import { Container, ContainerModule, interfaces } from 'inversify';

import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { INVERSIFY_NAMES } from './constants/inversify-names.constant';
import { PrismaService } from './database/prisma.service';
import { IError } from './errors/errors.interface';
import { ErrorsService } from './errors/errors.service';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { IBootstrapReturn } from './types/global.types';
import { IUserRepositoryService } from './users/repository/user.repository.interface';
import { UserRepositoryService } from './users/repository/user.repository.service';
import { UserService } from './users/services/user.service';
import { IUserService } from './users/services/user-service.interface';
import { UserController } from './users/user.controller';
import { IUserController } from './users/user-controller.interface';
import { App } from './app';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(INVERSIFY_NAMES.Logger).to(LoggerService).inSingletonScope();
	bind<IUserController>(INVERSIFY_NAMES.UserController).to(UserController);
	bind<IUserService>(INVERSIFY_NAMES.UserService).to(UserService);
	bind<IError>(INVERSIFY_NAMES.ErrorService).to(ErrorsService);
	bind<IConfigService>(INVERSIFY_NAMES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(INVERSIFY_NAMES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepositoryService>(INVERSIFY_NAMES.UserRepository).to(UserRepositoryService).inSingletonScope();
	bind<App>(INVERSIFY_NAMES.App).to(App);
});

const bootstrap = (): IBootstrapReturn => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(INVERSIFY_NAMES.App);
	app.init();

	return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
