import { IsEmail, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Имя пользователя не задано!' })
	@MinLength(3, { message: 'Имя должно быть не менее 3 символов!' })
	name: string;

	@IsEmail({}, { message: 'Емаил не указан!' })
	email: string;

	@IsString({ message: 'Пароль не указан!' })
	password: string;
}
