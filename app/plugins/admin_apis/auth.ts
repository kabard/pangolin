import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
import { compareSync } from 'bcrypt';
export class AuthRoutes {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/admin'
          });
    }
    initialize() {
        this._login();
        this._refresh();
        this.params.app.use(this.router.routes());
    }
    _login() {
        this.router.post('/jwt/auth',  async (ctx: any) => {
            try {
                const result = await this.params.app.models.UsersModel.getUserDetails(ctx.request.body.username);
                if (!compareSync(ctx.request.body.password, result.password)) {
                    throw new Error('Password does not match');
                }
                result.password = undefined;
                const token = ctx.generateJWTToken(result);
                  ctx.body = {
                      token: token,
                      username: result.username
                    };
                  ctx.session[result.username] = token;
            } catch (e) {
                console.log(e.stack);
                ctx.status = 406;
                ctx.body = e.stack.split('\n')[0];
            }
        });
    }
    _refresh() {
        this.router.get('/jwt/refresh', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
            try {
                const token = ctx.generateJWTToken(ctx.state.user.data);
                ctx.body = {
                    token: token,
                    username: ctx.state.user.data.username
                };
            } catch (e) {
                console.log(e);
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
}