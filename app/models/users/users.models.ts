import { Users, UsersSchema } from './users.schema';
import { BaseModel } from '../baseModel';
import { Roles } from './roles';

export class UsersModel extends BaseModel {
    public _model: UsersSchema;
    constructor() {
        super(new Users().model);

        this.verifyAdminFirstRun();
    }

    verifyAdminFirstRun() {
        this._model.find({ roles: 'admin' }).exec((err: any, doc: any) => {
            if (!err && doc) {
                console.log('\x1b[33m%s\x1b[0m', `\n\n
                    ######################################################################
                    ######################################################################
                    ##############             Admin Exists              #################
                                            Username: ${JSON.stringify(doc[0].username)}
                    ##############           Use Any To login            #################
                    ######################################################################
                    ######################################################################
                    \n\n`);
            } else {
                if (err === 'No admin users') {
                    const doc = {
                        username: 'ProxyDefault',
                        roles: 'admin',
                        password: 'MSProxy@2019'
                    };
                    this.save(doc).then((res: any) => {
                        console.log('\x1b[33m%s\x1b[0m', `\n\n
                            ######################################################################
                            ######################################################################
                            ##############         Admin Exists                  #################
                                    ${JSON.stringify(res)}
                            ##############       Use It to login first time      #################
                            ######################################################################
                            ######################################################################
                            \n\n`);
                    }).catch((err) => {
                        console.error(err);
                    });
                }
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