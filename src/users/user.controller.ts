import {BaseController} from '../common/base.controller';
import {NextFunction, Request, Response} from 'express';
import {LoggerService} from '../logger/logger.service';
import {HttpError} from '../errors/http.error';

export class UserController extends BaseController {

    constructor(logger: LoggerService) {
        super(logger)
        this.bindRoutes([{path: '/login', method: 'post', func: this.postLogin},
            {path: '/register', method: 'post', func: this.postRegister}
        ])
    }


    postLogin(req: Request, res: Response, next: NextFunction) {
        next(new HttpError(402, 'Authorization error', 'Login'))
    }

    postRegister(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')

    }


}

