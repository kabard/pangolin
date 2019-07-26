import { PluginType } from '../../plugin';
import { Policy } from './policy';

export const initWebApp = function(params: PluginType) {
    params.app.policy = params.app.policy || {};
    const policy = new Policy(params);
    params.app.policy['BasicAuthication'] = policy.BasicAuthication.bind(policy);
    params.app.policy['JWTAuth'] = policy.JWTAuth.bind(policy);
    params.app.policy['Authorization'] = policy.Authorization.bind(policy);
    params.app.policyInfo = policy.PolicyInfo();
    params.app.methodList = policy.MethodList();
};
