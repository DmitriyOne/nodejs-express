import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { INVERSIFY_NAMES } from '../constants/inversify-names.constant';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(INVERSIFY_NAMES.Logger) private loggerService: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			this.loggerService.log('[PrismaService] Успешно подключились к базе данных');
			await this.client.$connect();
		} catch (error) {
			if (error instanceof Error) {
				this.loggerService.error('[PrismaService] Ошибка подключения к базе данных: ' + error.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
