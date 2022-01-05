import express, {Express} from 'express';
import {Server} from 'http'
import {UserController} from './users/user.controller';
import {ExceptionFilter} from './errors/exception.filter';
import {inject, injectable} from 'inversify';
import {TYPES} from './types';
import {LoggerService} from './logger/logger.service';
import 'reflect-metadata';

@injectable()
export class App {
    app: Express
    server: Server
    port: number


    constructor(@inject(TYPES.ILoggerService) private logger: LoggerService,
                @inject(TYPES.IUserController) private userController: UserController,
                @inject(TYPES.ExceptionFilter) private exceptionFiler: ExceptionFilter,)
    {
        this.app = express();
        this.port = 8000;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFiler.catch.bind(this.exceptionFiler))
    }

    public async init() {
        this.useRoutes()
        this.useExceptionFilters()
        this.server = this.app.listen(this.port)
        this.logger.log(`Server started at http://localhost:${this.port}`)
    }
}