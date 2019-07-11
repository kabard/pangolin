import { PluginType } from '../../plugin';
import { Context } from 'koa';
import { NextFunction } from 'connect';
import composer = require('koa-compose');
type keyVal = {
    key: string,
    value: string
};
export class MiddlewareHandler {
    private params: PluginType;
    constructor (params: PluginType) {
        this.params = params;
    }
    DecoratorMiddleware( middlewareName: string | number, ...args: Array<string>) {
        console.log(`decorator ${middlewareName}: ${args}`);
        if (this.params.app.utils[middlewareName]) {
            return this.params.app.utils[middlewareName](...args);
        }
        return (ctx: Context, next: NextFunction) => next();
    }
    addCustomDetailsToCtx(content: Array<keyVal>) {
        return async (ctx: Context, next: NextFunction) => {
            content.forEach((eachElem: keyVal) => {
                ctx.state[ eachElem.key ] = eachElem.value;
            });
            await next();
        };
    }
}
