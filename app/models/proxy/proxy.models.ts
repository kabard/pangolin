
import { Proxy, ProxySchema  } from './proxy.schema';
import { BaseModel } from '../baseModel';

export class ProxyModel extends BaseModel {
    public _model: ProxySchema;
    public _config: any;
    constructor(config: any) {
        super(new Proxy().model);
        this._config = config;
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
    findByIdAndAppendRoute(id: string, doc: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            this._model.findByIdAndUpdate(id,
                {
                    $push: doc,
                },
                {
                    upsert: true,
                    new : true
                },
                function(err, document) {
                    if (err) {
                        reject(err);
                    }
                    resolve(document);
                });
        });
    }
}
