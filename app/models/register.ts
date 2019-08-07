import { CredentialModel } from './credentials/credentials.models';
import { UsersModel } from './users/users.models';
import { ProxyModel } from './proxy/proxy.models';
import { RouteModel } from './route/route.models';

export const ModelRegister = function(CONFIG: any) {
    return {
        UsersModel: new UsersModel(CONFIG),
        CredentialModel: new CredentialModel(CONFIG),
        ProxyModel: new ProxyModel(CONFIG),
        RouteModel: new RouteModel(CONFIG)
    };

};

