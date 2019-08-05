import { Middleware } from 'koa';
export interface PolicyList  {
    BasicAuthication(...args: Array<string>): Middleware;
    APIKey (...args: Array<string>): Middleware ;
    JWTAuth (...args: Array<string>): Middleware ;
    Authorization(role: Array<string>): Middleware;
}


