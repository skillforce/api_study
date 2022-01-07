import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'invalid email' })
	email: string;
	@IsString({ message: 'Password field is empty' })
	password: string;
	@IsString({ message: 'Name field is empty' })
	name: string;
}
