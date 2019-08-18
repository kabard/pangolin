import { PluginType } from '../../plugin';
const session = require('koa-session');
// import * as passport from 'koa-passport';
const RedisStore = require('koa-redis');

import { IoRedis } from './ioredis';

export const initWebApp = function(params: PluginType) {
    const redisConf: any = params.config.get('Redis');
    // add redis cluster configuration
    // const nodes = redisConf.nodes.map( (node: string ) => { return { host: node.split(':')[0], port: node.split(':')[1] }; });
    params.app.keys = ['secret', 'key'];
    const option = {
        // db: 'monitor',
        host: redisConf.host || '127.0.0.1',
        port: redisConf.port || 6379,
        dropBufferSupport: true,
        connectTimeout: 10000,
    };
    params.app.use(session({
        store: new RedisStore({
            key: redisConf.key,
            maxAge: 21600000,
            // isRedisCluster: true,
            // nodes: nodes,
            host: option.host || '127.0.0.1',
            port: option.port || 6379
        })
      }, params.app));
    //  a seperate client to store analytical data. As Koa-redis client does not provide all feature so used ioredis connection
    // move all redis logic to ioredis class.
    params.app.context['redis'] = new IoRedis(option).GETTER();
};
