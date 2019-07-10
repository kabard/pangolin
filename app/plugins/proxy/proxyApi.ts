import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
import { ProxyModel } from '../../models/proxy/proxy.models';
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
        const proxyM = this.params.app.models.ProxyModel;
        try {
            const routes: Array<any> = await proxyM.findWithCred();
            routes.forEach( (eachBasePath: any) => {
                this._addRoute(eachBasePath);
            });
        } catch (e) {
            console.log(e);
        }
        this.params.app.use(this.router.routes());

    }
    _addRoute(eachBasePath: any) {
        const middlewareFunc: Array<Middleware> = [this.middlewareHandler.addCustomDetailsToCtx([
            {key: 'customMeta', value: eachBasePath.credential}
        ])];
        // Add each policy in the middleware
        eachBasePath.policy.forEach(( eachPolicy: any) => {
            middlewareFunc.push(this.middlewareHandler.DecoratorMiddleware(eachPolicy.name, eachPolicy.arguments));
        });
        eachBasePath.routes.forEach( (eachProxy: any) => {
            eachProxy.policy.forEach( (eachPolicy: any) => {
                middlewareFunc.push(this.middlewareHandler.DecoratorMiddleware(eachPolicy.name, eachPolicy.arguments));
            });
            const Troute = this._getRoute(eachProxy.method);
            Troute(eachProxy.base_path, compose(middlewareFunc) , async (ctx: any) => {
                try {
                    const response = await axios({
                        method: eachProxy.method,
                        url : `${eachBasePath.remoteUrl}${eachProxy.remote_path}`
                    });
                    ctx.response.body = response.data;
                }
                catch (error) {
                    ctx.response.body = error.response.data;
                }
            });
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
