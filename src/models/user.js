const mongoose = require('mongoose');
const Schema = mongoose.Schema;
passportLocalMongoose   =   require('passport-local-mongoose');

const user = new Schema({
    username: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    currentLocation: {
        type: Object,
        default: null
    },
    emergencyContacts: {
        type: Object,
        default: null,
        ref: 'user'
    },
    photo: {
        type: Object,
        default: null
    },
    reports: {
        type: Object,
        default: null
    },
});
user.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', user);