import { CredentialModel } from './credentials/credentials.models';
import { UsersModel } from './users/users.models';
import { ProxyModel } from './proxy/proxy.models';

export const ModelRegister = function() {
    return {
        UsersModel: new UsersModel(),
        CredentialModel: new CredentialModel(),
        ProxyModel: new ProxyModel(),
    };

};

