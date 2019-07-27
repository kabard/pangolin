import { PluginType } from '../../plugin';
const session = require('koa-session');
// import * as passport from 'koa-passport';
const RedisStore = require('koa-redis');

export const initWebApp = function(params: PluginType) {
    const redisConf: any = params.config.get('Redis');
    // add redis cluster configuration
    // const nodes = redisConf.nodes.map( (node: string ) => { return { host: node.split(':')[0], port: node.split(':')[1] }; });
    params.app.keys = ['secret', 'key'];
    params.app.use(session({
        store: new RedisStore({
            key: redisConf.key,
            maxAge: 21600000,
            // isRedisCluster: true,
            // nodes: nodes,
            host: redisConf.host || '127.0.0.1',
            port: redisConf.port || 6379
        })
      }, params.app));
};
