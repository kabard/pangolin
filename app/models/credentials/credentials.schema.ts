import { Schema, model, Document, Model } from 'mongoose';


declare interface ICredentials extends Document {
    username: string;
    password: string;
    creation_date: Date;
}

export interface CredentialsSchema extends Model<ICredentials> {}

export class Credentials {

    private _model: Model<ICredentials>;

    constructor() {
        const schema =  new Schema({
            userid: {type : Schema.Types.ObjectId, ref : 'users'},
            type: { type: String, required: true, enum : ['basicAuth', 'JWT-Token', 'API-Key'], default: 'basicAuth' },
            username: { type: String, required: false },
            passowrd: { type: String, required: false },
            apiKey: { type: String, required: false },
            creation_date: { type: Date, default: Date.now },
        });

        this._model = model<ICredentials>('credentials', schema);
    }

    public get model(): Model<ICredentials> {
        return this._model;
    }
}