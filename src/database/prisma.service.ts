import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../types';
import { LoggerService } from '../logger/logger.service';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILoggerService) private logger: LoggerService) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[Prisma service] successful connected to database');
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error(`[Prisma service] Error in connecting to database ${err.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
