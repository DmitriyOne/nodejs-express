import 'reflect-metadata';

import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { INVERSIFY_NAMES } from '../constants/inversify-names.constant';
import { ENameEnvs } from '../enums/name.env.enums';
import { ILogger } from '../logger/logger.interface';

import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(INVERSIFY_NAMES.Logger) private loggerService: ILogger) {
		const result = config();

		if (result.error) {
			this.loggerService.error('[ConfigService] Не удалось загрузить .env или его не существует!');
		} else {
			this.loggerService.log('[ConfigService] Конфигурация .env загружена!');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: keyof typeof ENameEnvs): string {
		return this.config[key];
	}
}
