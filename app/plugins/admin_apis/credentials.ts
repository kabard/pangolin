import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
export class CredentialsRoute {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/credentials'
          });
    }
    initialize() {
        console.log('initialized ctx ');
        this._create();
        this.params.app.use(this.router.routes());
    }
    _create() {
        this.router.post('/create', this.params.app.utils.JWTAuth, this.params.app.utils.Authorization(['admin']) , async (ctx: any) => {
            try {
                const result = await this.params.app.models.CredentialModel.save(ctx.request.body);
                console.log('cedential ceated ! ', result);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }

}