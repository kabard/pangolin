import { PluginType } from '../../plugin';
const jsonwebtoken = require('jsonwebtoken');


export class Utils  {
    private params: PluginType;
    private secret: string;
    constructor(params: PluginType ) {
        this.params = params;
        this.secret = this.params.config.get('JWT.secret');
    }
    generateJWTToken(data: any ) {
        return jsonwebtoken.sign({
            data: data,
            exp: Math.floor(Date.now() / 1000) + parseInt(this.params.config.get('JWT.expiretime')),
          }, this.secret);
          // }, this.params.config.get('JWT.secret'));
    }
}