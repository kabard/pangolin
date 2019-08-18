
import { PluginType } from '../../plugin';
import { Middleware, Context } from 'koa';
import { NextFunction } from 'connect';


export class Monitor {
    private params: PluginType;
    constructor (params: PluginType) {
        this.params = params;
    }
    storeAnalyticsRedis (...args: Array<string>): Middleware {
        const self = this;
        return async function (ctx: Context, next: NextFunction) {
            const start = process.hrtime();
            await next ();
            const elapsed = process.hrtime(start)[1] / 1000000; // in milisecond
            const uniqueId =  ctx.UniqueIdForURL(ctx.URL.pathname, ctx.request.query );
            try {
                await ctx.redis.WriteAllDetails({
                    XCacheType: ctx.response.get('X-cache') || 'miss',
                    uniqueId: uniqueId,
                    time: new Date(),
                    elapsed: elapsed,
                    responseStatus: ctx.response.status
                });
            } catch (expection) {
                console.log(expection);
            }
        };
    }
}