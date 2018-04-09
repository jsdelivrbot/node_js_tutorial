const logger = require('../../libs/log')(module);

module.exports = function(app, db) {
    app.get('/times', function(req, res) {
        logger.info(req.method, req.url);
        let result = '';
        const times = 6;
        for (i=0; i < times; i++) {
            result += i + 'asd';
        }
        res.send(result);
    });
};