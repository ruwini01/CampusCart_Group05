const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Admin = mongoose.model('admins', adminSchema);

module.exports = Admin;