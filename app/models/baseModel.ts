
interface ModelMethods {
    save(): Promise<any>;
    update(): Promise<any>;
    find(): Promise<any>;
}

export class BaseModel implements ModelMethods {
    public _model: any;
    constructor(model: any) {
        this._model = model;
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
            this._model.find((err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}