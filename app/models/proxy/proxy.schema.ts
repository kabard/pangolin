import { Schema, model, Document, Model } from 'mongoose';

type Routetype =  {
    base_path: string,
    remote_path: string,
    method: string,
    policy: string
};
type policy = {
    name: string,
    arguments: Array<string>
};
declare interface IProxy extends Document {
    remote_url: string;
    routes: Array<Routetype>;
    policy: Array<policy>;
    creation_date: Date;
}

export interface ProxySchema extends Model<IProxy> {}

export class ProxyRoutes {

    private _model: Model<IProxy>;

    constructor() {
        const schema =  new Schema({
            remote_url: { type: String, required: true },
            routes: { type: Array, required: true },
            policy: {type: Array, required: false},
            creation_date: { type: Date, default: Date.now },
            credential: {type : Schema.Types.ObjectId, ref : 'credentials'},
        });

        this._model = model<IProxy>('proxyroutes', schema);
    }

    public get model(): Model<IProxy> {
        return this._model;
    }
}