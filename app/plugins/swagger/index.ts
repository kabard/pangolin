import { PluginType } from '../../plugin';
const koaSwagger = require('koa2-swagger-ui');

export const initWebApp = function(params: PluginType) {
    params.app.use(
        koaSwagger({
          routePrefix: '/swagger',
          swaggerOptions: {
            url: '/swagger.yml'
          }
        })
      );
};

