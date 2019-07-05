import { Middleware } from 'koa';
export type PolicyList = {
    BasicAuthication: Middleware
    APIKey: Middleware,
    JWTAuth: Middleware,
};


