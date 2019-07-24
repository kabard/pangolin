import { Credentials, CredentialsSchema, credentialType  } from './credentials.schema';
import { BaseModel } from '../baseModel';


export class CredentialModel extends BaseModel {
    public _model: CredentialsSchema;
    constructor() {
        super(new Credentials().model);
    }
    getCredentialType(): Promise<any> {
        return new Promise( (resolve, reject) => {
            resolve(credentialType);
        });
    }
}