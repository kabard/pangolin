import { PluginType } from '../../plugin';
import { Policy } from './policy';


export const initWebApp = function(params: PluginType) {
    // params.app.use(jwt({ secret: 'shared-secret' }));
    params.app.utils = params.app.utils || {};
    const policy = new Policy();
    params.app.utils['BasicAuthication'] = policy.BasicAuthication;
};
