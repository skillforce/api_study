import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { LoggerService } from '../logger/logger.service';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILoggerService) private logger: LoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error("Can't read file .env or it not exist");
		} else {
			this.logger.log('.env configuration were loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
