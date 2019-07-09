import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
import { compareSync } from 'bcrypt';
const jsonwebtoken = require('jsonwebtoken');
export class AuthRoutes {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/users'
          });
    }
    initialize() {
        this._login();
        this.params.app.use(this.router.routes());
    }
    _login() {
        this.router.post('/login',  async (ctx: any) => {
            try {
                const result = await this.params.app.models.UsersModel.getUserDetails(ctx.request.body.username);
                if (!compareSync(ctx.request.body.password, result.password)) {
                    throw new Error('Password does not match');
                    return;
                }
                result.password = undefined;
                const token =
                jsonwebtoken.sign({
                    data: result,
                    exp: Math.floor(Date.now() / 1000) + parseInt(this.params.config.get('JWT.expiretime')),
                  }, this.params.config.get('JWT.secret'));
                  ctx.body = token;
                  ctx.session[result.username] = token;
            } catch (e) {
                console.log(e);
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
}