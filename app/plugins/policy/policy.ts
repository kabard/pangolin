import { PolicyList } from './policy.interface';
import { PluginType } from '../../plugin';
import { Context, Middleware } from 'koa';
import { NextFunction } from 'connect';
import { Roles } from '../../models/users/roles';

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
    constructor(params: PluginType ) {
      this.params = params;
      this.secret = this.params.config.get('JWT.secret');
    }
    BasicAuthication (...args: Array<string>): Middleware {
      return async function (ctx: Context, next: NextFunction) {
        try {
          // add users details to context;
          const dummyAuthorizeContent: AuthorizeContent =  {
              data: {},
          };
            const userData = await this.params.app.models.UsersModel.findOne({_id: ctx.state.customMeta.userid});
            dummyAuthorizeContent.data = userData;
            ctx.state.user = dummyAuthorizeContent;
            console.log('here is the output', ctx.state.customMeta, ctx.state.user );
            return await auth({user: args[0], pass: args[1]})(ctx, next);
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
    APIKey(...args: Array<string>): Middleware {
      return async function(ctx: Context, next: NextFunction) {
        return new Promise((resolve, reject) => { });
      };
    }
    JWTAuth(...args: Array<string>): Middleware {
      const secret = this.secret;
      return async function (ctx: Context, next: NextFunction) {
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
      };
    }
    Authorization(role: Array<string>): Middleware {
        return async function(ctx: Context, next: NextFunction) {
          try {
            console.log(ctx.state);
            if ( role.indexOf(ctx.state.user.data.roles) == -1) {
              ctx.status = 401;
              ctx.body = 'you are not authorized';
            } else {
              console.log('inside else part of Auth');
              await next();
            }
          } catch (e) {
            console.log('inside catch part of Auth', e);
            ctx.status = 401;
            ctx.body = e;
          }
        };
    }
    /**
     * PolicyInfo()
     * returns the arguments expected in the Policy functions
     */
    public PolicyInfo() {
      return [
        {
          name: 'BasicAuthication',
          arguments: ['expects username', 'expects password']
        },
        {
          name: 'JWTAuth',
          arguments: [],
        },
        {
          name: 'Authorization',
          arguments: ['expects existing roles. can pass multiple roles ']
        }
      ];
    }
}
