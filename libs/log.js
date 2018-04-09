const winston = require('winston');
const moment = require('moment');
const ENV = process.env.NODE_ENV;

/**
 * Логированиеƒ
 * @param {*} module 
 */
function getLogger(module) {
    const path = module.filename.split('/').slice(-1).join('/');
    const timestamp = () => moment(new Date()).format('YYYY/MM/DD, hh:mm:ss');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV === 'development') ? 'debug' : 'error',
                label: path,
                timestamp
            }),
            new winston.transports.File({
                filename: 'logs.log',
                json: false,
                label: path,
                timestamp
            })
        ]
    });
}

module.exports = getLogger;