import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { LoggerService } from './logger/logger.service';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './users/user.controller.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILoggerService) private logger: LoggerService,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFiler: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFiler.catch.bind(this.exceptionFiler));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server started at http://localhost:${this.port}`);
	}
}
