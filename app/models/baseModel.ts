
interface ModelMethods {
    save(doc: any): Promise<any>;
    update(): Promise<any>;
    find(): Promise<any>;
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
    update(): Promise<any> {
        return  new Promise( (resolve, reject) => {
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
}