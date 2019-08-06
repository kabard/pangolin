import { Users, UsersSchema } from './users.schema';
import { BaseModel } from '../baseModel';
import { Roles } from './roles';
// import * as CONFIG from 'config';

export class UsersModel extends BaseModel {
    public _model: UsersSchema;
    public _config: any;
    constructor(config: any) {
        super(new Users().model);
        this._config = config;
        this._verifyAdminFirstRun();
    }

    _verifyAdminFirstRun() {
        this._model.count({ roles: 'admin' }, (err: any, count: any) => {
            if (err || count < 1 ) {
                const doc = {
                    username: this._config.get('defaultadmin'),
                    password: this._config.get('defaultadminpassword'),
                    roles: 'admin'
                };
                this.save(doc).then((res: any) => {
                    console.log('\x1b[33m%s\x1b[0m', `\n\n
                        ######################################################################
                        ######################################################################
                        ##############        Default Admin Created                  #################
                                ${JSON.stringify(res)}
                        ##############       Use It to login first time      #################
                        ######################################################################
                        ######################################################################
                        \n\n`);
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }

    save(doc: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const document = new this._model(doc);
            document.save((err: any, doc: any) => {
                if (err) {
                    reject(err);
                } else {
                    // don't show password, TODO : handle it in schema
                    doc.password = undefined;
                    resolve(doc);
                }
            });
        });
    }
    getUserDetails(username: string) {
        return new Promise((resolve, reject) => {
            this._model.findOne({ username: username }).select('+password').exec((err: any, doc: any) => {
                if (!err && doc) {
                    resolve(doc);
                } else {
                    reject(err || 'user does not exist');
                }
            });
        });
    }
    getListOfRoles() {
        return new Promise((resolve, reject) => {
            resolve(Roles);
        });
    }
}