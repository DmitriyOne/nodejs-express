import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { INVERSIFY_NAMES } from '../../constants/inversify-names.constant';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../entities/user.entity';

import { IUserRepositoryService } from './user.repository.interface';

@injectable()
export class UserRepositoryService implements IUserRepositoryService {
	constructor(@inject(INVERSIFY_NAMES.PrismaService) private prismaService: PrismaService) {}

	async create(user: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
