export const INVERSIFY_NAMES = {
	App: Symbol.for('Application'),
	Logger: Symbol.for('ILogger'),
	UserController: Symbol.for('IUserController'),
	UserService: Symbol.for('IUserService'),
	ErrorService: Symbol.for('IError'),
	ConfigService: Symbol.for('IConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UserRepository: Symbol.for('UserRepository'),
};
