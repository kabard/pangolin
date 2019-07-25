import { PluginType } from '../../plugin';
import * as Router from 'koa-router';
export class CredentialsRoute {
    private params: PluginType;
    private router: Router;
    constructor(params: PluginType) {
        this.params = params;
        this.router = new Router({
            prefix: '/admin/credentials'
          });
    }
    initialize() {
        console.log('initialized ctx ');
        this._query();
        this._create();
        this._update();
        this._policyList();
        this._getCredentialType();
        this._delete();
        this.params.app.use(this.router.routes());
    }
    _create() {
        this.router.post('/create', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']) , async (ctx: any) => {
            try {
                const result = await this.params.app.models.CredentialModel.save(ctx.request.body);
                console.log('cedential ceated ! ', result);
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
                const result = await this.params.app.models.CredentialModel.find(filter, field);
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                console.log('error occured', e);
                ctx.body = e.toString();
            }
        });
    }
    _update() {
        this.router.post('/update/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']) , async (ctx: any) => {
            try {
                const id = ctx.params.id;
                const data = ctx.request.body;
                const result = await this.params.app.models.CredentialModel.update({_id: id}, {$set: data});
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e;
            }
        });
    }
    _delete() {
        this.router.delete('/delete/:id', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']) , async (ctx: any) => {
            try {
                const id = ctx.params.id;
                const result = await this.params.app.models.CredentialModel.deleteWithReferencialIntegrity(id, this.params.app.models.RouteModel, {proxyId: id}  );
                ctx.body = result;
            } catch (e) {
                ctx.status = 406;
                ctx.body = e.toString();
            }
        });
    }
    _policyList () {
        this.router.get('/policy/list', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
            ctx.body = this.params.app.policyInfo;
        });
    }
    _getCredentialType() {
        this.router.get('/type', this.params.app.policy.JWTAuth(), this.params.app.policy.Authorization(['admin']), async (ctx: any) => {
           try {
            const result = await this.params.app.models.CredentialModel.getCredentialType();
            ctx.body = result;
           } catch ( e ) {
               ctx.status = 406;
               ctx.body = e.toString();
           }
        });
    }

}