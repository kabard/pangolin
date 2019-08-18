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
    GETTER() {
        return this.redisConnection;
    }
}