const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const auth = require('../middleware/authToken');
const adminAuth = require('../middleware/adminAuth');


router.post('/broadcast-notification', adminAuth, async (req, res) => {
  try {
    console.log("sending broadcast message");
    
    const { title, body } = req.body;
    
  
    if (!title || !body) {
      return res.status(400).json({ msg: 'Please include both title and body' });
    }
    
    const notification = {
      title,
      body,
      date: new Date()
    };
    

    const result = await Users.updateMany(
      {},
      { $push: { notifications: notification } }
    );
    
    return res.json({
      success: true,
      message: `Notification sent to ${result.modifiedCount} users`,
      notification
    });
    
  } catch (err) {
    console.error('Error broadcasting notification:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;