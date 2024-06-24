import { UserModel } from '@prisma/client';

import { User } from '../entities/user.entity';

export interface IUserRepositoryService {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
