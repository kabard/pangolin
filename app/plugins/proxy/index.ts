import { PluginType } from '../../plugin';
import { ProxyApi } from './proxyApi';
export const initWebApp = function(params: PluginType) {
    const proxyapi = new ProxyApi(params);
    proxyapi.initialize();
};

