import { UserController } from './users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { UsersService } from './users/users.service';

export const TYPES = {
	Application: Symbol.for('Application'),
	ILoggerService: Symbol.for('ILoggerService'),
	IUserController: Symbol.for('UserController'),
	UsersService: Symbol.for('UsersService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
};
