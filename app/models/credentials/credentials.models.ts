import { Credentials, CredentialsSchema  } from './credentials.schema';
import { BaseModel } from '../baseModel';


export class CredentialModel extends BaseModel {
    public _model: CredentialsSchema;
    constructor() {
        super(new Credentials().model);
    }
}