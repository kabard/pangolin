import { PluginType } from '../../plugin';
import { Context } from 'koa';
import { NextFunction } from 'connect';
import axios from 'axios';
import { Method, AxiosRequestConfig } from 'axios';

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
        if (this.params.app.policy[middlewareName]) {
            return this.params.app.policy[middlewareName](...args);
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
    ProxyRequest(method: Method, url: string) {
        return  async (ctx: any) => {
            try {
                const option: AxiosRequestConfig = {
                    method: method, url: url
                };
                option.url += ctx.request.query ?  this.params.app.utils.convertJSONtoQuery(ctx.request.query) : undefined;
                option.data = ctx.request.body ? ctx.request.body : undefined;
                const response = await axios(option);
                ctx.response.body = response.data;
            }
            catch (error) {
                ctx.response.body = error.toString();
            }
        };
    }
}
