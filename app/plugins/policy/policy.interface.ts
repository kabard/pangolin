import { Context, Middleware } from 'koa';
import { NextFunction } from 'connect';
export interface PolicyList  {
    BasicAuthication(...args: Array<string>): Middleware;
    APIKey (...args: Array<string>): Middleware ;
    JWTAuth (...args: Array<string>): Middleware ;
    Authorization(role: Array<string>): Middleware;
}


