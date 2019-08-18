import { PluginType } from '../../plugin';
const jsonwebtoken = require('jsonwebtoken');


export class Utils  {
    private params: PluginType;
    constructor(params: PluginType ) {
        this.params = params;
    }
    generateJWTToken(data: any ) {
        return jsonwebtoken.sign({
            data: data,
            exp: Math.floor(Date.now() / 1000) + parseInt(this.params.config.get('JWT.expiretime')),
          }, this.params.config.get('JWT.secret'));
    }
    convertJSONtoQuery(obj: any= {}) {
        let query = '';
        Object.keys(obj).forEach((key, index) => {
            query = query.length > 0 ? `&${key}=${obj[key]}` : `?${key}=${obj[key]}`;
        });
        return query;
    }
    convertParamsToURL(url: string, params: any= {}) {
        let _str = '';
        Object.keys(params).forEach( (key: string ) => {
            if ( params[key] && params[key].length > 0) {
                _str += '/' + params[key];
            }
        });
        return (`${url}${_str}`).replace(/(?<!http:|https:)\/\//g, '/');
    }
    UniqueIdForURL(url: string, query: string) {
        url += query ?  this.convertJSONtoQuery(query) : undefined;
        const urlBase64 = Buffer.from(url).toString('base64');
        return urlBase64;
    }
}
/**
 * ServeFromCache();
 * attached to ctx object.
 * add condition to check if object should be served from  cache or not
 */
export function ServeFromCache(): boolean {
    if ( this.request.header['X-cache-ignore']) {
        return false;
    }
    return true;
}
