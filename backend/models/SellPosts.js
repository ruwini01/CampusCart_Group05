const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellPostsSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    itemname: {
        type: String,
        required: true
    },
    condition:{
        type:String,
        required: true
    },
    brand: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    originalprice: {
        type: String,
    },
    isnagotiable:{
        type:Boolean,
        default:false
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

const SellPosts = mongoose.model('sellposts', sellPostsSchema);

module.exports = SellPosts;