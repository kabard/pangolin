
interface ModelMethods {
    save(doc: any): Promise<any>;
    update(query: any, update: any ): Promise<any>;
    find(): Promise<any>;
    findByIdAndUpdate(id: string, doc: any): Promise<any>;
}

export class BaseModel implements ModelMethods {
    public _model: any;
    constructor(model: any) {
        this._model = model;
    }
    save(doc: any ): Promise<any> {
       return  new Promise( (resolve, reject) => {
           const document = new this._model(doc);
           document.save( (err: any, doc: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
           });
       });
    }
    update(query: any, doc: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            this._model.update(query, doc, function(err: any, document: any) {
                if (err) {
                    reject(err);
                }
                resolve (document);
            });
        });
    }
    find(doc: any = {}, field: any = {}): Promise<any> {
        return  new Promise( (resolve, reject) => {
            this._model.find(doc, field, (err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
    findOne(doc: any = {}, field: any = {}): Promise<any> {
        return  new Promise( (resolve, reject) => {
            this._model.findOne(doc, field, (err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
    delete(id: string): Promise <any> {
        return new Promise ( (resolve, reject) => {
            this._model.remove({_id: id}, function (err: any, document: any) {
                if ( err) {
                    reject(err);
                }
                resolve(document);
            });
        });
    }
    findByIdAndUpdate(id: string, doc: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            this._model.findByIdAndUpdate({_id: id}, doc, {new: true}, function(err: any, document: any) {
                if (err) {
                    reject(err);
                }
                resolve (document);
            });
        });
    }
}