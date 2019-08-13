import { Schema, model, Document, Model } from 'mongoose';
const crypto = require('crypto');


declare interface ICredentials extends Document {
    userid: string;
    type: string;
    creation_date: Date;
    apiKey ?: string;
}

export const  credentialType = ['BasicAuthentication', 'JWT-Token', 'API-Key'];

export interface CredentialsSchema extends Model<ICredentials> {}

export class Credentials {

    private _model: Model<ICredentials>;

    constructor() {
        const schema =  new Schema({
            userid: {type : Schema.Types.ObjectId, ref : 'users', required: true},
            type: { type: String, required: true, enum :  credentialType, default: 'BasicAuthentication' },
            apiKey: { type: String, required: false },
            creation_date: { type: Date, default: Date.now },
        });

        schema.pre('save', function(next: any) {
            _preSaveValidation.call(this, next);
        });
        this._model = model<ICredentials>('credentials', schema);
    }

    public get model(): Model<ICredentials> {
        return this._model;
    }
}
function _preSaveValidation(next: any) {
    this.type.toLowerCase() == 'api-key' && (this.apiKey = crypto.randomBytes(16).toString('hex'));
    next();
}