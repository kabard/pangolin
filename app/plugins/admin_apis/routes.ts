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
        this.params.app.use(this.router.routes());
    }
    _create() {
        this.router.post('/create', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.save(ctx.request.body);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
    _read () {
        this.router.get('/get', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.find(ctx.request.query);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
    _update () {
        this.router.post('/update/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.update(ctx.body.params, ctx.request.body);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
    _delete () {
        this.router.post('/delete/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']),   async (ctx: any) => {
            try {
                const result = await this.params.app.models.RouteModel.delete(ctx.body.params);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
}