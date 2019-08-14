import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
import { MiddlewareHandler } from './middlewareHandler';
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
            routes.forEach((eachRoute: any) => {
                this._addRoute(eachRoute);
            });
        } catch (e) {
            console.log(e);
        }
        this.params.app.use(this.router.routes());

    }
    _addRoute(eachRoute: any) {
        const middlewareFunc: Array<Middleware> = [this.middlewareHandler.addCustomDetailsToCtx([
            { key: 'customMeta', value: eachRoute.proxyId.credential }
        ])];
        const isWildCard = eachRoute.isWildCard;
        // Add the Policies defined in Routes first
        eachRoute.policy.forEach((eachPolicy: any) => {
            middlewareFunc.push(this.middlewareHandler.DecoratorMiddleware(eachPolicy.name, ...eachPolicy.arguments));
        });
        eachRoute.proxyId.policy.forEach((eachPolicy: any) => {
            middlewareFunc.push(this.middlewareHandler.DecoratorMiddleware(eachPolicy.name, ...eachPolicy.arguments));
        });
        // get the koa router method
        const Troute = this._getRoute(eachRoute.method);
        console.log('registering route, Base:', eachRoute.base_path, '\t remote_url:', `${eachRoute.proxyId.remote_url}${eachRoute.remote_path}`);

        Troute(eachRoute.base_path, compose(middlewareFunc) , this.middlewareHandler.ProxyRequest(eachRoute.method, `${eachRoute.proxyId.remote_url}${eachRoute.remote_path}`));
        eachRoute.isWildCard && Troute(`${eachRoute.base_path}:param1/:param2*`, this.middlewareHandler.ProxyRequest(eachRoute.method, `${eachRoute.proxyId.remote_url}${eachRoute.remote_path}`) );

    }

    _getRoute(method: string, ...params: any) {
        switch (method) {
            case 'get':
                return this.router.get.bind(this.router, params);
            case 'post':
                return this.router.post.bind(this.router, params);
            default:
                return this.router.get.bind(this.router, params);
        }
    }
}
