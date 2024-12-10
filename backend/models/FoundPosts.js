const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foundPostsSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  itemname: {
    type: String,
    required: true,
  },
  founddate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  contact: {
    type: Object,
    required: true,
  },
  hidephoneno: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const FoundPosts = mongoose.model("foundPosts", foundPostsSchema);

module.exports = FoundPosts;
