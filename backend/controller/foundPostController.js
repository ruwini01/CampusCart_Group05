const mongoose = require("mongoose");
const foundPostModel = require("../models/foundPosts");

// getAllPosts,
// getSinglePost,
// createNewPost,
// updatePost,
// deletePost

// get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await foundPostModel.find({}).sort({ createdAt: -1 }); // sort by newest
    //   check if there no posts
    if (posts.length === 0) {
      return res.status(404).json({ message: " No posts Found " });
    }
    // if there is return it
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// get single posts with its ID
const getSinglePost = async (req, res) => {
  try {
    // get its id
    const { id } = req.params;
    // validate the id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "No Such ID" });
    }
    // get the post by its id
    const posts = foundPostModel.findById(id);
    // check if valid posts
    if (!posts) {
      res.status(400).json("Not Valid posts");
    }
    // if it's ok return it
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new posts
const createNewPost = async (req, res) => {
  try {
    // get the input fields
    const {
      itemname,
      lostdate,
      location,
      description,
      images,
      contact,
      hidephoneno,
      status,
      date,
    } = req.body;
    // destructure status to icon, and name

    // create the posts
    const newPosts = await foundPostModel.create({
      itemname,
      lostdate,
      location,
      description,
      images,
      contact,
      hidephoneno,
      status,
      date,
    });
    // return it
    return res.status(200).json(newPosts);
  } catch (error) {
    // separate each error
    let errorMessage = "";
    if (error.errors) {
      errorMessage = Object.values(error.errors)
        .map((error) => error.message)
        .join(",");
    } else {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// update posts
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    // validate the id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such ID" });
    }
    const updatePosts = await foundPostModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatePosts) {
      return res.status(400).json({
        error:
          "Couldn't Update the posts, make sure you filled the required fields",
      });
    }

    // alright
    return res.status(200).json(updatePosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// delete posts

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    // validate the id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No Such ID" });
    }
    const deletePostsByItsID = await foundPostModel.findByIdAndUpdate(id);

    // successful
    return res.status(200).json(deletePostsByItsID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createNewPost,
  updatePost,
  deletePost,
};
