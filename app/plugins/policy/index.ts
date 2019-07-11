import { PluginType } from '../../plugin';
import { Policy } from './policy';


export const initWebApp = function(params: PluginType) {
    params.app.utils = params.app.utils || {};
    const policy = new Policy(params);
    params.app.utils['BasicAuthication'] = policy.BasicAuthication.bind(policy);
    params.app.utils['JWTAuth'] = policy.JWTAuth.bind(policy);
    params.app.utils['Authorization'] = policy.Authorization.bind(policy);
};
