import 'reflect-metadata';

import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IConfigService } from '../../config/config.service.interface';
import { INVERSIFY_NAMES } from '../../constants/inversify-names.constant';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entities/user.entity';
import { IUserRepositoryService } from '../repository/user.repository.interface';

import { IUserService } from './user-service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(INVERSIFY_NAMES.ConfigService) private configService: IConfigService,
		@inject(INVERSIFY_NAMES.UserRepository) private userRepositoryService: IUserRepositoryService,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(name, email);
		const salt = this.configService.get('KEY');

		await newUser.setPassword(password, Number(salt));

		const existedUser = await this.userRepositoryService.find(email);

		if (existedUser) {
			return null;
		}

		return this.userRepositoryService.create(newUser);
	}

	async validateUser(user: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepositoryService.find(user.email);
		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.name, existedUser.email, existedUser.password);
		return newUser.comparePassword(user.password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepositoryService.find(email);
	}
}
