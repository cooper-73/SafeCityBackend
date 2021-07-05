const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name: {
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
    password:  {
        type: String,
        required: true
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

module.exports = mongoose.model('user', user);