import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Емаил не указан!' })
	email: string;

	@IsString({ message: 'Пароль не указан!' })
	password: string;
}
