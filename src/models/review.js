const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const review = new Schema({
    calification:{
        type: Number,
        required: true,
    },
    content:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('review',review)
