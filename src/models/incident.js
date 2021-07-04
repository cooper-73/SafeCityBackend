const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incident = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        default: null
    }
});

module.exports = mongoose.model('incident', incident);