export type EnvTuple = {
    configName: string,
    envName: string,
    defaultValue: string
};
/**
 * setDefaultENV(list);
 * loads default environment variable if no environment is provided.
 * @param list {Array<Envtuple>} override the default environment values
 */
export function setDefaultENV(list ?: Array<EnvTuple>) {
    list = list ? (list) : _getDefaultList();
    list.forEach((each) => {
        process.env[each.envName] = process.env[each.envName] || each.defaultValue;
    });
}
function _getDefaultList(): Array<EnvTuple> {
    return [
        {
            configName: 'redis.key',
            envName: 'REDIS_SECRET_KEY',
            defaultValue: 'secret'
        },
        {
            configName: 'JWT.secret',
            envName: 'JWT_SECRET_KEY',
            defaultValue: 'secret'
        },
        {
            configName: 'JWT.expiretime',
            envName: 'JWT_EXPIRETIME',
            defaultValue: '3600'
        },
    ];
}