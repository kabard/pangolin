import { PluginType } from '../../plugin';
const koaBunyanLogger = require('koa-bunyan-logger');
import { logger } from './logger';

export const initWebApp = function(params: PluginType) {
    params.app.use(koaBunyanLogger(logger));
    params.app.use(koaBunyanLogger.requestLogger());
    params.app.use(koaBunyanLogger.timeContext());
};

