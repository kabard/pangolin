import { PolicyList } from './policy.interface';
import { PluginType } from '../../plugin';
import { Context, Middleware } from 'koa';
import { NextFunction } from 'connect';
import { Roles } from '../../models/users/roles';

const auth = require('koa-basic-auth');
const jwt = require('koa-jwt');

export class Policy implements PolicyList {
  private params: PluginType;
  private secret: string;
    constructor(params: PluginType ) {
      this.params = params;
      this.secret = this.params.config.get('JWT.secret');
    }
    async BasicAuthication (ctx: Context, next: NextFunction): Promise<any> {
        try {
            return await auth({user: ctx.customMeta.get('user'), pass: ctx.customMeta.get('password')})(ctx, next);
          } catch (err) {
            if (401 == err.status) {
              ctx.status = 401;
              ctx.set('WWW-Authenticate', 'Basic');
              ctx.body = 'You can\'t access :( ';
            } else {
              throw err;
            }
          }
    }
    APIKey (ctx: Context, next: NextFunction): Promise<any> {
      return new Promise((resolve, reject) => { });
    }
    JWTAuth (ctx: Context, next: NextFunction): Promise<any> {
      const secret = this.secret;
      try {
        return jwt({ secret: secret })(ctx, next);
      } catch (err) {
        if ( 401 === err.status) {
          ctx.status = 401;
          const errMessage = err.originalError ? err.originalError.message : err.message;
          ctx.body = {
            error: errMessage
          };
          ctx.set('X-Status-Reason', errMessage);
        } else {
          throw err;
        }
      }
    }
    Authorization(role: Array<string>): Middleware {
        return async function(ctx: Context, next: NextFunction) {
          try {
            if ( role.indexOf(ctx.state.user.data.roles) == -1) {
              ctx.status = 401;
              ctx.body = 'you are not autorized';
            } else {
              console.log('inside else part of Auth');
              await next();
            }
          } catch (e) {
            console.log('inside catch part of Auth');
            ctx.status = 401;
            ctx.body = e;
          }
        };
    }
}
