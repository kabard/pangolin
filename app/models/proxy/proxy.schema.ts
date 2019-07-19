import { Schema, model, Document, Model } from 'mongoose';

type policy = {
    name: string,
    arguments: Array<string>
};
declare interface IProxy extends Document {
    remote_url: string;
    policy: Array<policy>;
    creation_date: Date;
    name: string;
}

export interface ProxySchema extends Model<IProxy> {}

export class Proxy {

    private _model: Model<IProxy>;

    constructor() {
        const schema =  new Schema({
            name : {type: String, required: true},
            remote_url: { type: String, required: true },
            policy: {type: Array, required: false},
            creation_date: { type: Date, default: Date.now },
            credential: {type : Schema.Types.ObjectId, ref : 'credentials'},
        });

        this._model = model<IProxy>('proxies', schema);
    }

    public get model(): Model<IProxy> {
        return this._model;
    }
}