import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'invalid email' })
	email: string;
	@IsString({ message: 'Password field is empty' })
	password: string;
}
