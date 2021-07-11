const mongoose = require('mongoose');
const Schema = mongoose.Schema;
passportLocalMongoose   =   require('passport-local-mongoose');

// const Contact = {
//     name: String,
//     phone: String,
//     photo: Object
// }

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },

    currentLocation: {
        type: Object,
        default: null
    },
    emergencyContacts: {
        type: Array,
        default: [],
    },
    photo: {
        type: Object,
        default: null
    },
    reports: {
        type: Array,
        default: []
        // Array with report_id created
    },
    attending_locations: {
        type: Array,
        default: []
    }
});
user.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', user);