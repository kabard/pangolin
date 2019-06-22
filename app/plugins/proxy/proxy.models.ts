
import { ProxyRoutes, ProxySchema  } from './proxy.schema';

interface ModelMethods {
    save(): Promise<any>;
    update(): Promise<any>;
    find(): Promise<any>;
}

export class ProxyModel implements ModelMethods {
    private _model: ProxySchema;
    constructor() {
        this._model = new ProxyRoutes().model;
    }
    save(): Promise<any> {
       return  new Promise( (resolve, reject) => {
       });
    }
    update(): Promise<any> {
        return  new Promise( (resolve, reject) => {
        });
    }
    find(): Promise<any> {
        return  new Promise( (resolve, reject) => {
            this._model.find((err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}