import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
// import { RouteModel } from '../../models/route/route.models';
import { MiddlewareHandler } from './middlewareHandler';
import axios from 'axios';
import { Middleware } from 'koa';
const compose = require('koa-compose');


export class ProxyApi {
    params: PluginType;
    router: Router;
    middlewareHandler: MiddlewareHandler;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router();
        this.middlewareHandler = new MiddlewareHandler(params);
    }
    async initialize() {
        // load from the routes from mapping file
        const proxyM = this.params.app.models.RouteModel;
        try {
            const routes: Array<any> = await proxyM.findWithProxyAndCredential();
            routes.forEach( (eachRoute: any) => {
                this._addRoute(eachRoute);
            });
        } catch (e) {
            console.log(e);
        }
        this.params.app.use(this.router.routes());

    }
    _addRoute(eachRoute: any) {
        const middlewareFunc: Array<Middleware> = [this.middlewareHandler.addCustomDetailsToCtx([
            {key: 'customMeta', value: eachRoute.proxyId.credential}
        ])];
        // Add the Policies defined in Routes first
        eachRoute.policy.forEach(( eachPolicy: any) => {
            middlewareFunc.push(this.middlewareHandler.DecoratorMiddleware(eachPolicy.name, ...eachPolicy.arguments));
        });
        eachRoute.proxyId.policy.forEach( (eachPolicy: any) => {
            middlewareFunc.push(this.middlewareHandler.DecoratorMiddleware(eachPolicy.name, ...eachPolicy.arguments));
        });
        // get the koa router method
        const Troute = this._getRoute(eachRoute.method);
        console.log('registering route', eachRoute.base_path);
        Troute(eachRoute.base_path, compose(middlewareFunc) , async (ctx: any) => {
            try {
                const response = await axios({
                    method: eachRoute.method,
                    url : `${eachRoute.proxyId.remote_url}${eachRoute.remote_path}`
                });
                ctx.response.body = response.data;
            }
            catch (error) {
                ctx.response.body = error;
            }
        });
    }
    _getRoute(method: string, ...params: any) {
        switch (method) {
            case 'get':
                return this.router.get.bind(this.router, params);
                break;
            case 'post':
                return this.router.post.bind(this.router, params);
                break;
            default:
                return this.router.get.bind(this.router, params);
        }
    }
}
