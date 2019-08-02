import { Schema, model, Document, Model } from 'mongoose';
import { Roles, defaultRole } from './roles';
import { hashSync } from 'bcrypt';
// const crypto = require('crypto');

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
        schema.pre('update', function( next: any ) {
            const content = this.getUpdate();
            if ( content['$set'].password ) {
                if ( isValidPassword(content['$set'].password) ) {
                    content['$set'].password = hashSync(content['$set'].password, 5);
                } else {
                    next (new Error('Password not valid! Expecting minimum eight characters, at least one letter, one number and one special character.'));
                }
            } else {
                delete content.$set.password;
            }
            this.update(this.getQuery(), content);
            next();
        });

        this._model = model<IUsers>('users', schema);
    }
    public get model(): Model<IUsers> {
        return this._model;
    }
}

function _preSaveValidation(next: any) {
    if (this.password && isValidPassword(this.password)) {
        this.password = hashSync(this.password, 5);
        next();
        return;
    }
    next(new Error('Password not valid! Expecting minimum eight characters, at least one letter, one number and one special character.'));
}
function isValidPassword(password: string): boolean {
   const validate = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
   return validate.test(password);
}
