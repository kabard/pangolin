import { PolicyList } from './policy.interface';
import { PluginType } from '../../plugin';
import { Context, Middleware } from 'koa';
import { NextFunction } from 'connect';

const auth = require('koa-basic-auth');
const jwt = require('koa-jwt');

// Authorization expect data inside context.state.user
// This is just to make it more readble, and to understand what ctx.state.user should contain
export type AuthorizeContent = {
  data: {
    roles?: string,
    _id?: string,
    username?: string,
    creation_date?: Date
  },
  exp?: number,
  iat?: number
};
export class Policy implements PolicyList {
  private params: PluginType;
  private secret: string;
  constructor (params: PluginType) {
    this.params = params;
    this.secret = this.params.config.get('JWT.secret');
  }
  BasicAuthentication (...args: Array<string>): Middleware {
    return async function (ctx: Context, next: NextFunction) {
      try {
        // add users details to context;
        const dummyAuthorizeContent: AuthorizeContent = {
          data: {},
        };
        const userData = await this.params.app.models.UsersModel.findOne({ _id: ctx.state.customMeta.userid });
        dummyAuthorizeContent.data = userData;
        ctx.state.user = dummyAuthorizeContent;
        console.log('here is the output', ctx.state.customMeta, ctx.state.user);
        return await auth({ user: args[0], pass: args[1] })(ctx, next);
      } catch (err) {
        if (401 == err.status) {
          ctx.status = 401;
          ctx.set('WWW-Authenticate', 'Basic');
          ctx.body = 'You can\'t access :( ';
        } else {
          throw err;
        }
      }
    }.bind(this);
  }
  APIKey (...args: Array<string>): Middleware {
    return async function (ctx: Context, next: NextFunction) {
      return new Promise((resolve, reject) => { });
    };
  }
  JWTAuth (...args: Array<string>): Middleware {
    const secret = this.secret;
    return async function (ctx: Context, next: NextFunction) {
      try {
        return jwt({ secret: secret })(ctx, next);
      } catch (err) {
        if (401 === err.status) {
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
    };
  }
  Authorization (role: Array<string>): Middleware {
    return async function (ctx: Context, next: NextFunction) {
      try {
        console.log(ctx.state);
        if (role.indexOf(ctx.state.user.data.roles) == -1) {
          ctx.status = 401;
          ctx.body = 'you are not authorized';
        } else {
          await next();
        }
      } catch (e) {
        console.log('Failed to authorized', e);
        ctx.status = 401;
        ctx.body = e;
      }
    };
  }
  Cache (...args: Array <string>): Middleware {
    return async function (ctx: Context, next: NextFunction) {
      let url = ctx.URL.pathname;
      url += ctx.request.query ?  ctx.convertJSONtoQuery(ctx.request.query) : undefined;
      const urlBase64 = Buffer.from(url).toString('base64');
      const cachedContent = ctx.session[urlBase64];
      ctx.session['hits'] = (ctx.session['hits'] || 0) + 1;
      if ( cachedContent ) {
        ctx.body = cachedContent;
        return;
      } else {
        await next();
        ctx.session[urlBase64] = ctx.body;
        ctx.session['miss'] = (ctx.session['miss'] || 0) + 1;
      }
    };
  }
  /**
   * PolicyInfo()
   * returns the arguments expected in the Policy functions
   */
  public PolicyInfo () {
    return [
      {
        name: 'BasicAuthentication',
        arguments: ['expects username', 'expects password']
      },
      {
        name: 'JWTAuth',
        arguments: [],
      },
      {
        name: 'Authorization',
        arguments: ['expects existing roles. can pass multiple roles ']
      },
      {
        name: 'Cache',
        arguments: []
      }
    ];
  }
  /**
   * MethodList()
   * returns the arguments expected in the Policy functions for HTTP methods
   */
  public MethodList () {
    return ['get', 'post', 'put', 'delete', 'patch'];
  }
}
