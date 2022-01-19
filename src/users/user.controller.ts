import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UsersService } from './users.service';
import { ILoggerInterface } from '../logger/logger.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILoggerService) private loggerService: ILoggerInterface,
		@inject(TYPES.UsersService) private UsersService: UsersService,
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
			return next(new HttpError(422, 'User or password is wrong', 'Login'));
		}
		this.ok(res, { email: result.email, id: result.id });
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
}
