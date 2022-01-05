import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { LoggerService } from '../logger/logger.service';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILoggerService) private loggerService: LoggerService) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.postLogin },
			{ path: '/register', method: 'post', func: this.postRegister },
		]);
	}

	postLogin(req: Request, res: Response, next: NextFunction): void {
		next(new HttpError(402, 'Authorization error', 'Login'));
	}

	postRegister(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}
