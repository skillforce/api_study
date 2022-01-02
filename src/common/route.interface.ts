import {Request,Response,NextFunction} from 'express';
import { Router} from 'express/ts4.0';

export interface IControllerRoute {
    path: string,
    func: (req: Request, res: Response, next: NextFunction) => void
    method: keyof Pick<Router,'get' | 'post' | 'delete' | 'patch' | 'put'>
}