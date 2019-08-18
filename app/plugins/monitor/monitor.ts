
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
            const uniqueID =  ctx.UniqueIdForURL(ctx.URL.pathname, ctx.request.query );
            try {
                ctx.redis.multi()
                    .incr(ctx.response.get('X-cache') || 'miss')
                    .incr(`${uniqueID}:${ctx.response.status}`)
                    .incr(`${uniqueID}:${ctx.response.get('X-cache')}`)
                    .append(`${uniqueID}:responseTime`, JSON.stringify({time: new Date(), response: elapsed})).exec(function(err: any, result: any){
                        if (!err) {
                            console.log(`ERROR: failed to store in Redis`, err);
                        }
                    });
            } catch (expection) {
                console.log(expection);
            }
        };
    }
}