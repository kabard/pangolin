import { Schema, model, Document, Model } from 'mongoose';

type Routetype =  {
    base_path: string,
    remote_path: string,
    method: string,
    policy: string
};
declare interface IProxy extends Document {
    remoteUrl: string;
    routes: Array<Routetype>;
    policy: Array<string>;
    creation_date: Date;
}

export interface ProxySchema extends Model<IProxy> {}

export class ProxyRoutes {

    private _model: Model<IProxy>;

    constructor() {
        const schema =  new Schema({
            remoteUrl: { type: String, required: true },
            routes: { type: Array, required: true },
            policy: {type: String, required: false},
            creation_date: { type: Date, default: Date.now }
        });

        this._model = model<IProxy>('proxyroutes', schema);
    }

    public get model(): Model<IProxy> {
        return this._model;
    }
}