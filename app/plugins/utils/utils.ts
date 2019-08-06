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
}