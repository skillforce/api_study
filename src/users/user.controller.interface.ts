import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	postLogin: (req: Request, res: Response, next: NextFunction) => void;
	postRegister: (req: Request, res: Response, next: NextFunction) => void;
}
