const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellPostsSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  itemname: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalprice: {
    type: Number,
  },
  isnagotiable: {
    type: Boolean,
    default: false,
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
  date: {
    type: Date,
    default: Date.now,
  },
});

const SellPosts = mongoose.model("sellposts", sellPostsSchema);


/* 
usersSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastUser = await Users.findOne().sort({ userId: -1 });
        this.userId = lastUser ? lastUser.userId + 1 : 1;
    }
    next();
}); */

usersSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastUser = await Users.findOne().sort({ userId: -1 });
    this.userId = lastUser ? lastUser.userId + 1 : 1;
  }
  next();
});


module.exports = SellPosts;
