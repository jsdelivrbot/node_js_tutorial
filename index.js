const express = require('express');
const MongoClient = require('mongodb').MongoClient;

/**
 * midleware
 */
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

/**
 * express
 */
const app = express();

/**
 * app parts
 */
const config = require('./config');
const logger = require('./libs/log')(module);

// const http = require('http');

app.set('port', (process.env.PORT || config.get('port')));
app.listen(app.get('port'), () => {
    logger.info('Node app is running');
    logger.verbose('PORT:', app.get('port'));
});

/**
 * statics
 */
app.use(express.static(__dirname + '/public'));

/**
 * config for logger
 * @param {*} tokens 
 * @param {*} req 
 * @param {*} res 
 */
const morganMessage = (tokens, req, res) => {
    const result = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms'
    ].join(' ');

    logger.info(result);
    logger.info(req.cookies)

    return result;
}

/**
 * logger
 */
if ('development' == app.get('env')) {
    app.use(morgan(morganMessage))
} else {
    app.use(morgan('default'))
}

/**
 * body parser
 * req.body
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

/**
 * headers -> req.cookies
 */
app.use(cookieParser('you!'))

// views is directory for all template files
// ejs
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

/**
 * routes
 * !after bodyParser
 */
require('./app/routes')(app, {});

// main routes

app.get('/', function(req, res) {
    res.render('pages/index', { cookies: Object.keys(req.cookies).join(' ') });
});

app.get('/cool', function(req, res) {
    res.render('pages/cool');
});

const User = require('./models/user');
app.get('/users', function(req, res, next) {
    User.find({}, (err, users) => {
        if (err) next(err);
        res.json(users);
    })
})

// else ... ... ...

app.use((req, res, next) => {
    if ('development' == app.get('env')) {
        next(new Error('Fuck!'));
    } else {
        res.status(500);
        res.send('Fuck! Sorry...')
    }
})

if ('development' == app.get('env')) {
    const errorHandler = require('errorhandler');
    const notifier = require('node-notifier');
    const errorNotification = (err, str, req) => {
        const title = 'Error in ' + req.method + ' ' + req.url;
        logger.error(title);
        logger.error(err);

        notifier.notify({
            title: title,
            message: str
        })
    }

    app.use(errorHandler({ log: errorNotification }));
}