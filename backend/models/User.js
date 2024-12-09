const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userId:{
        type:Number,
        required:true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilepic:{
        type:String,
    },
    regno: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    savedposts:{
        type:Array,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

const Users = mongoose.model('users', usersSchema);


usersSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastUser = await Users.findOne().sort({ userId: -1 });
        this.userId = lastUser ? lastUser.userId + 1 : 1;
    }
    next();
});

module.exports = Users;