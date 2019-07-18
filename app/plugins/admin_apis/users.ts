import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
export class UsersRoute {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/admin/users'
          });
    }
    initialize() {
        this._query();
        this._create();
        this._list();
        this.params.app.use(this.router.routes());
    }
    _create() {
        this.router.post('/create', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.UsersModel.save(ctx.request.body);
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
                const result = await this.params.app.models.UsersModel.find();
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
                const result = await this.params.app.models.UsersModel.find(filter, field);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                console.log('error occured', e);
                ctx.body = e.toString();
            }
        });
    }
}