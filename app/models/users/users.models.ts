import { Users, UsersSchema  } from './users.schema';
import { BaseModel } from '../baseModel';



export class UsersModel extends BaseModel {
    public _model: UsersSchema;
    constructor() {
        super(new Users().model);
    }
}