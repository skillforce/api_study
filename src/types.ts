import { UserController } from './users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';

export const TYPES = {
	Application: Symbol.for('Application'),
	ILoggerService: Symbol.for('ILoggerService'),
	IUserController: Symbol.for('UserController'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
};
