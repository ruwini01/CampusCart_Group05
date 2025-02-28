const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardingPostsSchema = new Schema({
    category:{
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    facilities: {
        type: Array,
        required: true
    },
    capacity: {
        type: String,
        required: true
    },
    distance:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    rentprice:{
        type:String,
        required:true
    },
    negotiable:{
        type:Boolean,
        default:false
    },
    images:{
        type: Array,
    },
    contact:{
        type: Object,
        required:true
    },
    hidephoneno:{
        type: Boolean,
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

const BoardingPosts = mongoose.model('boardingposts', boardingPostsSchema);

module.exports = BoardingPosts;