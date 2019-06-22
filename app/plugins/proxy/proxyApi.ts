import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
import { ProxyModel } from './proxy.models';
import axios from 'axios';

export class ProxyApi {
    params: PluginType;
    router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router();
    }
    async initialize() {
        // load from the routes from mapping file
        const proxyM = new ProxyModel();
        try {
            const routes: Array<any> = await proxyM.find();
            routes.forEach( (eachBasePath: any) => {
                this._addRoute(eachBasePath);
            });
        } catch (e) {
            console.log(e);
        }
        this.params.app.use(this.router.routes());

    }
    _addRoute(eachBasePath: any) {
        eachBasePath.routes.forEach( (eachProxy: any) => {
            console.log(`added api ${eachProxy.base_path}`);
            const Troute = this._getRoute(eachProxy.method);
            // All the Authentication and middleware should be added here.
            // The Proxy action should also come from database!
            Troute(eachProxy.base_path, async (ctx: any) => {
                axios({
                    method: eachProxy.method,
                    url : `${eachBasePath.remoteUrl}${eachProxy.remote_path}`
                }).then((response) => {
                    console.log(response);
                    ctx.body = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    ctx.body = error.response.data;
                });
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