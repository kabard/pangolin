import { Schema, model, Document, Model } from 'mongoose';


declare interface IUsers extends Document {
    username: string;
    password: string;
    creation_date: Date;
}

export interface UsersSchema extends Model<IUsers> {}

export class Users {

    private _model: Model<IUsers>;

    constructor() {
        const schema =  new Schema({
            username: { type: String, required: true },
            password: { type: Array, required: true },
            creation_date: { type: Date, default: Date.now },
        });

        this._model = model<IUsers>('users', schema);
    }

    public get model(): Model<IUsers> {
        return this._model;
    }
}