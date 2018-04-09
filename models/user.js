const mongoose = require('./../libs/mongoose');
const CryptoJS = require('crypto-js');

const Schema = mongoose.Schema;

/**
 * User schema
 */
const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

/**
 * 
 */
schema.methods.encryptPassword = function(password) {
    return CryptoJS.HmacSHA1(password, this.salt);
};

/**
 * Вирутальное поле, которое в БД сохраняться не будет
 */
schema.virtual('password')
    .set(function(password) {
        this._plainPasword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPasword;
    })

/**
 * 
 */
schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
}

exports.User = mongoose.model('User', schema);