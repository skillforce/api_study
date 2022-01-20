import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ILoggerInterface } from '../logger/logger.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { IUsersServiceInterface } from './users.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILoggerService) private loggerService: ILoggerInterface,
		@inject(TYPES.UsersService) private UsersService: IUsersServiceInterface,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.postRegister,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.postLogin,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async postLogin(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.UsersService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'Authorization Error', 'Login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async postRegister(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.UsersService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'The same user is already exist'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}
