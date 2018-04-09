const mongoose = require('./libs/mongoose');
const async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(err, result) {
    // if (err) throw err;
    console.log(arguments);
    mongoose.disconnect();
})

/**
 * Open DB
 * @param {*} callback
 */
function open(callback) {
    console.log("open");
    mongoose.connection.on('open', callback);
}

/**
 * Удаление БД
 * @param {*} callback
 */
function dropDatabase(callback) {
    console.log("drop");
    const db = mongoose.connection.db;
    db.dropDatabase(callback);
}

/**
 * Подключение моделей
 */
function requireModels(callback) {
    console.log("require");
    require('./models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        // гарантирует, что когда все индексы будут созданы вызовется колбэк
        // TODO: разобраться с индексами
        mongoose.models[modelName].ensureIndexes(callback)
    }, callback)
}

/**
 * Создание тестовых записей
 * @param {*} callback
 */
function createUsers(callback) {
    console.log('createUsers');

    const users = [
        { username: 'Tester', password: 'secret' },
        { username: 'Tester2', password: 'secret' },
        { username: 'admin', password: '123qwe' }
    ];

    async.each(users, (userData, callback) => {
        const user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

/**
 * close DB
 * @param {*} callback
 */
function close(callback) {
    mongoose.disconnect(callback);
}

mongoose.connection.on('disconnected', function() {
    console.log('state:', mongoose.connection.readyState);
    console.log("disconnected");
});
