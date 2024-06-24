import { ENameEnvs } from '../enums/name.env.enums';

export interface IConfigService {
	get: (key: keyof typeof ENameEnvs) => string;
}
