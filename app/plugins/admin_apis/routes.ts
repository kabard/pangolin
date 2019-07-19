import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
export class Route {
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
        this._read();
        this._update();
        this._delete();
        this._query();
        this.params.app.use(this.router.routes());
    }
    _create() {
        this.router.post('/create', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.save(ctx.request.body);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e.toString();
            }
        });
    }
    _read () {
        this.router.get('/fetch', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.find(ctx.request.query);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e.toString();
            }
        });
    }
    _update () {
        this.router.post('/update/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e.toString();
            }
        });
    }
    _delete () {
        this.router.delete('/delete/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.delete(ctx.params.id);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e.toString();
            }
        });
    }
    _query() {
        this.router.get('/query', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
            try {
                const filter = JSON.parse(ctx.request.query['filter'] || '{}') || {};
                const field = JSON.parse(ctx.request.query['field'] || '{}') || {};
                const result = await this.params.app.models.RouteModel.find(filter, field);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                console.log('error occured', e);
                ctx.body = e.toString();
            }
        });
    }
}