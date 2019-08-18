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
      const urlBase64 = ctx.UniqueIdForURL(ctx.URL.pathname, ctx.request.query );
      try {
        const cachedContent = await ctx.redis.getCachedContent(urlBase64);
        if ( (cachedContent || {}).body && ctx.serveFromCache() ) {

          ctx.body = JSON.parse(cachedContent.body);
          ctx.response.status = parseInt(cachedContent.status);
          ctx.set('X-cache', 'hit');
          return;
        } else {
          throw 'cache miss';
        }
      } catch (err) {
        await next();
        // const body = typeof ctx.body === 'object' ? JSON.stringify(ctx.body) : ctx.body;
        const pipeline = ctx.redis.GetConnection().pipeline()
            .set(`${urlBase64}:body`, JSON.stringify(ctx.body))
            .set(`${urlBase64}:status`, ctx.response.status.toString());
        // cache failure cases for shorter time.
        if (ctx.response.status > 399 ) {
            pipeline
            .expire(`${urlBase64}:body`, 20)
            .expire(`${urlBase64}:status`, 20)
            .exec();
        } else {
          // don't early expire;
          pipeline.exec();
        }
        // set cache miss to header
        ctx.set('X-cache', 'miss');
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
