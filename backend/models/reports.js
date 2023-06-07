const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    gname: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
    reported_by: {
        type: String,
        required: true
    },
    reported_to: {
        type: String,
        required: true
    },
    concern: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;