import { Credentials, CredentialsSchema, credentialType  } from './credentials.schema';
import { BaseModel } from '../baseModel';


export class CredentialModel extends BaseModel {
    public _model: CredentialsSchema;
    public _config: any;
    constructor(config: any) {
        super(new Credentials().model);
        this._config = config;
    }
    getCredentialType(): Promise<any> {
        return new Promise( (resolve, reject) => {
            resolve(credentialType);
        });
    }
}