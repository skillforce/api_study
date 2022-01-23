import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersServiceInterface } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};
const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersServiceInterface;

beforeAll(() => {
	container.bind<IUsersServiceInterface>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersServiceInterface>(TYPES.UsersService);
});
let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'skillforce@mail.ru',
			name: 'Denis',
			password: '7401642D',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('7401642D');
	});
	it('ValidateUser function should return UserModel when user exist in database', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'skillforce@mail.ru',
			password: '7401642D',
		});

		expect(res).toEqual(createdUser);
	});
	it("ValidateUser function should return null when user doesn't exist", async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const validateUser = await usersService.validateUser({
			email: 'skillforce@mail.ru',
			password: '7401642D',
		});
		expect(validateUser).toEqual(null);
	});
	it('ValidateUser function should return null when entered password is incorrect', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const validateUser = await usersService.validateUser({
			email: 'skillforce@mail.ru',
			password: '7401642D1',
		});
		expect(validateUser).toEqual(null);
	});
});
