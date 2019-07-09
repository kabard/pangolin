import { Schema, model, Document, Model } from 'mongoose';
import { Roles, defaultRole } from './roles';
import { hashSync } from 'bcrypt';


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
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true, select: false },
            creation_date: { type: Date, default: Date.now },
            roles: { type: String, required: true, enum : Roles, default: defaultRole }
        });
        schema.pre('save', function(next: any) {
            _preSaveValidation.call(this, next);
        });

        this._model = model<IUsers>('users', schema);
    }
    public get model(): Model<IUsers> {
        return this._model;
    }
}

function _preSaveValidation(next: any) {
    this.password = hashSync(this.password, 5);
    next();
}