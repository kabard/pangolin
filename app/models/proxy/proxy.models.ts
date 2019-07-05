
import { ProxyRoutes, ProxySchema  } from './proxy.schema';
import { BaseModel } from '../baseModel';

export class ProxyModel extends BaseModel {
    public _model: ProxySchema;
    constructor() {
        super(new ProxyRoutes().model);
    }
    findWithCred(): Promise<any> {
        return  new Promise( (resolve, reject) => {
            this._model.find().populate('credential').exec((err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}