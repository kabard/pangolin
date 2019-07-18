import { PluginType } from '../../plugin';
import { Utils } from './utils';


export const initWebApp = function(params: PluginType) {
    params.app.utils = params.app.utils || {};
    const utils = new Utils(params);
    params.app.utils['generateJWTToken'] = utils.generateJWTToken.bind(utils);
};
