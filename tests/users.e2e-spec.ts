import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;
let jwtToken: string;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'Deniska@mail.ru', name: 'Denis', password: 'password' });

		expect(res.statusCode).toBe(422);
	});
	it('Register - success', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'Olga1985@mail.ru', name: 'Olga', password: 'password' });

		expect(res.statusCode).toBe(200);
		expect(res.body.id).not.toBe(undefined);
		expect(res.body.email).not.toBe(undefined);
	});
	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'Deniskaa@mail.ru', password: 'password' });

		expect(res.statusCode).toBe(401);
	});
	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'Deniska@mail.ru', password: 'password' });

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'Deniska@mail.ru', password: 'password' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('Deniska@mail.ru');
	});
	it('Info - error', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'Deniska@mail.ru', password: 'password' });
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
