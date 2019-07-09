import { Context, Middleware } from 'koa';
import { NextFunction } from 'connect';
export interface PolicyList  {
    BasicAuthication (Ctx: Context, next: NextFunction): Promise<any> ;
    APIKey (Ctx: Context, next: NextFunction): Promise<any>;
    JWTAuth (Ctx: Context, next: NextFunction): Promise<any> ;
    Authorization(role: Array<string>): Middleware;
}


