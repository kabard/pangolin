import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
import { compareSync } from 'bcrypt';
export class Analytics {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/admin/analytics'
          });
    }
    initialize() {
        this._getTotalDetails();
        this.params.app.use(this.router.routes());
    }
    _getTotalDetails () {
        this.router.get('/gettotal', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
            try {
                const result = await ctx.redis.getAnalyticsDetail();
                console.log(result);
                // const result = await this.params.app.models.CredentialModel.find();
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                console.log('error occured', e);
                ctx.body = e.toString();
            }
        });
    }
}