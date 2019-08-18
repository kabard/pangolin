import { PluginType } from '../../plugin';
import { Monitor } from './monitor';

export const initWebApp = function(params: PluginType) {
    params.app.policy = params.app.policy || {};
    const monitor = new Monitor(params);
    params.app.policy['AnalyticsRedis'] = monitor.storeAnalyticsRedis.bind(monitor);
};
