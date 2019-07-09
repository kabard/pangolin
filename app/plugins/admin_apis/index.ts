import { PluginType } from '../../plugin';
import { CredentialsRoute } from './credentials';
import { UsersRoute } from './users';
import { AuthRoutes } from './auth';

export const initWebApp = function(params: PluginType) {
    const cred = new CredentialsRoute(params);
    const user = new UsersRoute(params);
    const auth = new AuthRoutes(params);
    cred.initialize();
    user.initialize();
    auth.initialize();
};
