
const Redis = require('ioredis');

export class IoRedis {
    public option: any;
    redisConnection: any;
    constructor (option: any) {
        this.option = option;
        this.option.retryStrategy = option.retryStrategy || this._retryStrategy;
        this.option.maxRetriesPerRequest = option.retryStrategy || 1;
        this.redisConnection = new Redis(option);
        this._redisEvents();
    }
    private _retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
    private _redisEvents() {
    // log ready and reconnecting event
    }
    append(key: string, value: string) {
        this.redisConnection.append(key, value);
    }
    WriteAllDetails(writeParams: WriteParamsType ) {
        return new Promise( (resolve, reject) => {
            this.redisConnection.multi()
                .incr('analytics:' + writeParams.XCacheType || 'miss') // total miss or hit
                .incr(`analytics:response:${writeParams.responseStatus}`) // total response status count
                .incr(`analytics:${writeParams.uniqueId}:${writeParams.responseStatus}`) // url response status count
                .incr(`analytics:${writeParams.uniqueId}:${writeParams.XCacheType}`) // url cache hit or miss count
                .append(`analytics:${writeParams.uniqueId}:responseTime`, JSON.stringify({time: writeParams.time, response: writeParams.elapsed}))
                .exec(function(err: any, result: any) {
                if (!err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    getAnalyticsDetail() {
        return new Promise( (resolve, reject) => {
            this.redisConnection.keys('analytics*', (err: any, data: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                const operations: Array<any> = [];
                data.forEach((key: string) => {
                    operations.push(['get', key]);
                });

                this.redisConnection.mget(data, (err: any, values: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log(`mget:`, values);
                    values = values.map( (v: any, i: number) => {
                        const obj: any = {};
                        obj[data[i]] = v;
                        return obj;
                    });
                    resolve(values);
                });
            });
        } );
    }
    getCachedContent(baseURLKey: string) {
        return new Promise( (resolve, reject) => {
            this.redisConnection.pipeline()
                .get(`${baseURLKey}:body`)
                .get(`${baseURLKey}:status`)
                .exec().then( (result: any) => {
                    console.log('redis returned', result);
                    resolve({
                        body: result[0][1],
                        status: result[1][1]
                    });
                }).catch( (err: any) => {
                    reject (err);
                });
        });
    }
    GetConnection() {
        return this.redisConnection;
    }
}

export type WriteParamsType = {
    XCacheType: string,
    uniqueId: string,
    time: Date,
    elapsed: number,
    responseStatus: number
};