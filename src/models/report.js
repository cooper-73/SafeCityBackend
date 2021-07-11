const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const report = new Schema({
    victim: {
        type: Object,
        required: true
    },
    incident: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    details: {
      type: String,
      default: null,
    },
    attending: {
        type: Array,
        default: []
    },
    location: {
        type: Object,
        required: true
    },
    fileURL: {
        type: Object,
        default: null
    },
    voiceMessages: {
        type: Object,
        default: null
    },
    videosURL: {
        type: Object,
        default: null
    },
    public_id:{
      type:String,
      default: null
    }
});

module.exports = mongoose.model('report', report);
