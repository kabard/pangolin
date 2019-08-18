import { PluginType } from '../../plugin';
import {  ServeFromCache, Utils } from './utils';


export const initWebApp = function(params: PluginType) {
    params.app.utils = params.app.utils || {};
    const utils = new Utils(params);
    params.app.context['generateJWTToken'] = utils.generateJWTToken.bind(utils);
    params.app.context['convertJSONtoQuery'] = utils.convertJSONtoQuery.bind(utils);
    params.app.context['convertParamsToURL'] = utils.convertParamsToURL.bind(utils);
    params.app.context['UniqueIdForURL'] = utils.UniqueIdForURL.bind(utils);
    params.app.context.serveFromCache = ServeFromCache;
};
