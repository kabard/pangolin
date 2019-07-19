import { RouteSchema, Route  } from './route.schema';
import { BaseModel } from '../baseModel';


export class RouteModel extends BaseModel {
    public _model: RouteSchema;
    constructor() {
        super(new Route().model);
    }
    /**
     * findWithProxyAndCredential();
     * provide routes with proxy and credential documents included
     */
    findWithProxyAndCredential(): Promise<any> {
        return new Promise( (resolve, reject) => {
        this._model.find().populate({path: 'proxyId', populate: {path: 'credential'}}).exec( function(err, document) {
                if (err) {
                    reject(err);
                }
                resolve( document);
            });
        });
    }
}