import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
export class ProxyRoute {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/admin/routes'
          });
    }
    initialize() {
        this._create();
        this._list();
        this._query();
        this._appendRoutes();
        this.params.app.use(this.router.routes());
    }
    _create() {
        this.router.post('/add', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.ProxyModel.save(ctx.request.body);
                delete result.password;
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
    _list() {
        this.router.get('/list', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async(ctx: any) => {
            try {
                const result = await this.params.app.models.ProxyModel.find();
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
    _query() {
        this.router.get('/query', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
            try {
                const filter = JSON.parse(ctx.request.query['filter'] || '{}') || {};
                const field = JSON.parse(ctx.request.query['field'] || '{}') || {};
                const result = await this.params.app.models.ProxyModel.find(filter, field);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                console.log('error occured', e);
                ctx.body = e.toString();
            }
        });
    }
    _appendRoutes() {
        this.router.post('/appendRoute/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
            try {
                console.log(ctx.params.id);
                const data = { routes: ctx.request.body };
                console.log(data);
                const result = await this.params.app.models.ProxyModel.findByIdAndUpdate(ctx.params.id, data);
                ctx.body = ctx.params.id;
            } catch (e) {
                ctx.status = 406;
                console.log('error occured', e);
                ctx.body = e.toString();
            }
        });
    }
}