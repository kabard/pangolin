import { RouteSchema, Route  } from './route.schema';
import { BaseModel } from '../baseModel';


export class RouteModel extends BaseModel {
    public _model: RouteSchema;
    public _config: any;
    constructor(config: any) {
        super(new Route().model);
        this._config = config;
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
    findByIdAndUpdate(id: string, doc: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            this._model.findByIdAndUpdate({_id: id}, doc, {new: true}, function(err, document) {
                if (err) {
                    reject(err);
                }
                resolve (document);
            });
        });
    }
}