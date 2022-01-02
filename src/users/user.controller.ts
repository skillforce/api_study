import {BaseController} from '../common/base.controller';
import {IControllerRoute} from '../common/route.interface';
import {NextFunction, Request, Response} from 'express';
import {LoggerService} from '../logger/logger.service';

export class UserController extends BaseController {

    constructor(logger: LoggerService) {
        super(logger)
        this.bindRoutes([{path: '/login', method: 'post', func: this.postLogin},
            {path: '/register', method: 'post', func: this.postRegister}
        ])
    }


    postLogin(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'login')
    }

    postRegister(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')
    }


}

