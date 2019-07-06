import { PolicyList } from './policy.interface';
import { PluginType } from '../../plugin';
import { Context } from 'koa';
import { NextFunction } from 'connect';

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('koa-basic-auth');

export class Policy implements PolicyList {
  private params: PluginType;
    constructor(params: PluginType ) {
      this.params = params;
    }
    async BasicAuthication (ctx: Context, next: NextFunction) {
        const nextCall: any = undefined;
        try {
            const nextCall = await auth({user: ctx.customMeta.get('user'), pass: ctx.customMeta.get('password')})(ctx, next);
            return nextCall;
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
    APIKey (ctx: Context, next: NextFunction) {

    }
    JWTAuth (ctx: Context, next: NextFunction) {

    }
}
