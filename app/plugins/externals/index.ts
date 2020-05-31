import { PluginType } from '../../plugin';
const serve = require('koa-static');
const koaValidator = require('koa-async-validator');
import * as koaBody from 'koa-body';
import * as cors from '@koa/cors';


export const initWebApp = function(params: PluginType) {
    params.app.use(koaBody());
    params.app.use(cors());
    params.app.use(koaValidator());
    params.app.use(serve('public'));


};
