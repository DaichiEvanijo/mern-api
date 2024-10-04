const whiteList = require('./whiteList');

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials:true
}

module.exports = corsOptions;