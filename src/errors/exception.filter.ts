import {Request, Response} from 'express';
import {LoggerService} from '../logger/logger.service';
import {IExceptionFilter} from './exception.filter.interface';
import {HttpErrorClass} from './http-error.class';

export class ExceptionFilter implements IExceptionFilter {
    logger: LoggerService

    constructor(logger: LoggerService) {
        this.logger = logger
    }


    catch(error: Error | HttpErrorClass, req: Request, res: Response) {
        if (error instanceof HttpErrorClass) {
            this.logger.error(`[${error.context}] Error: ${error.statusCode}:${error.message}`)
            res.status(error.statusCode).send({err: error.message})
        } else {
            this.logger.error(`${error.message}`)
            res.status(500).send({err: error.message})
        }
    }


}