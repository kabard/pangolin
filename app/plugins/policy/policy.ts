import { PolicyList } from './policy.interface';
import { Context } from 'koa';
import { NextFunction } from 'connect';

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('koa-basic-auth');

export class Policy implements PolicyList {
    constructor() {

    }
    async BasicAuthication (ctx: Context, next: NextFunction) {
        const nextCall: any = undefined;
        try {
            const nextCall = await auth({user: 'a', pass: 'b'})(ctx, next);
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