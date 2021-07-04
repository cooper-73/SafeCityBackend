const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const report = new Schema({
    victim: {
        type: Object,
        required: true
    },
    incident: {
        type: Object,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    details: String,
    attending: {
        type: Object,
        default: null
    },
    location: {
        type: Object,
        required: true
    },
    photos: {
        type: Object,
        default: null
    },
    voiceMessages: {
        type: Object,
        default: null
    },
    videos: {
        type: Object,
        default: null
    }
});

module.exports = mongoose.model('report', report);