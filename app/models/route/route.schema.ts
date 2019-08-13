import { Schema, model, Document, Model } from 'mongoose';

type policy = {
    name: string,
    arguments: Array<string>
};
declare interface IRoute extends Document {
    remote_path: string;
    base_path: string;
    policy: Array<policy>;
    creation_date: Date;
    name: string;
    method: string;
    isWildCard: boolean;
}

export interface RouteSchema extends Model<IRoute> {}

export class Route {

    private _model: Model<IRoute>;

    constructor() {
        const schema =  new Schema({
            name : {type: String, required: true},
            remote_path: { type: String, required: true },
            base_path: { type: String, required: true, unique: true },
            policy: {type: Array, required: false},
            isWildCard: {type: Boolean, required: true},
            creation_date: { type: Date, default: Date.now },
            proxyId: {type : Schema.Types.ObjectId, ref : 'proxies', required: true},
            method: {type: String, required: true, enum: ['get', 'post', 'post', 'patch', 'delete']}
        });

        this._model = model<IRoute>('routes', schema);
    }

    public get model(): Model<IRoute> {
        return this._model;
    }
}