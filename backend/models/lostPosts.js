const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lostPostsSchema = new Schema({
    itemname: {
        type: String,
        required: true
    },
    lostdate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    images:{
        type:Array,
    },
    contact:{
        type:Object,
        required:true
    },
    hidephoneno:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

const LostPosts = mongoose.model('lostposts', lostPostsSchema);

module.exports = LostPosts;