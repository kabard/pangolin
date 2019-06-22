import { PluginType } from '../../plugin';
import { connect } from './connection';
export const initWebApp = function(params: PluginType) {
    const connString: any = params.config.get('mongodb');
    connect(connString.url);
};
