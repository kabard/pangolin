import { PluginType } from '../../plugin';
import { CredentialsRoute } from './credentials';
import { UsersRoute } from './users';
import { AuthRoutes } from './auth';
import { Proxy  } from './proxy';
import { Route } from './routes';


export const initWebApp = function(params: PluginType) {
    const cred = new CredentialsRoute(params);
    const user = new UsersRoute(params);
    const auth = new AuthRoutes(params);
    const proxy = new Proxy(params);
    const routes = new Route(params);
    cred.initialize();
    user.initialize();
    auth.initialize();
    proxy.initialize();
    routes.initialize();
};
