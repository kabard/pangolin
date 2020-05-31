import { PluginType } from '../../plugin';
const session = require('koa-session');
// import * as passport from 'koa-passport';
const RedisStore = require('koa-redis');

import { IoRedis } from './ioredis';

export const initWebApp = function(params: PluginType) {
    const redisConf: any = params.config.get('Redis');
    // add redis cluster configuration
    params.app.keys = ['secret', 'key'];
    const option = {
        // db: 'monitor',
        host: redisConf.host,
        port: redisConf.port,
        dropBufferSupport: true,
        connectTimeout: 10000,
    };
    params.app.use(session({
        store: new RedisStore({
            key: redisConf.key,
            maxAge: 21600000,
            // isRedisCluster: true,
            // nodes: nodes,
            host: option.host,
            port: option.port
        })
      }, params.app));
    //  a seperate client to store analytical data. As Koa-redis client does not provide all feature so used ioredis connection
    // move all redis logic to ioredis class.
    params.app.context['redis'] = new IoRedis(option);
};
