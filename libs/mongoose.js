const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = require('bluebird')

mongoose.connect(config.get('mogoose:uri'), { useMongoClient: true }, config.get('mongoose:options'))
    .then(
        () => {
            console.log('connect is ready')
        },
        (err) => {
            console.log('DB connect: fuck!')
        }
    );

module.exports = mongoose;