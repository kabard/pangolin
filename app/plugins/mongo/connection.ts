import * as db from 'mongoose';

export const connect = function( url: string) {

    _connectWithRetry(url);
    db.connection.on('error', err => {
        console.log(`MongoDB connection error: ${err}`);
        // tslint:disable-next-line: no-null-keyword
        setTimeout(_connectWithRetry.bind( null, url), 5000);
    });
    db.connection.on('connected', () => {
        console.log('MongoDB is connected');
    });
};

// do retry if connection fails
function _connectWithRetry(url: string) {
    return db.connect(url, { useNewUrlParser: true });
}

