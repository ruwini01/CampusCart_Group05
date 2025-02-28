const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/signupverify', upload.single('image'), async (req, res) => {
    const imageFile = req.file;
    console.log(imageFile);
    
  
    if (!imageFile) {
      return res
        .status(400)
        .send({ success: false, message: "No image file provided" });
    }
  
    const imagePath = imageFile.path;
  
    try {
      const formData = new FormData();
      formData.append("image", fs.createReadStream(imagePath));
  
      const response = await axios.post(
        "http://127.0.0.1:5000/extract-text",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );
  
      // Remove the uploaded file after processing
      await fs.remove(imagePath);
  
      // Extracted text from the response
      const extractedText = response.data.text;
  
      // Regex to find the first Enrollment No
      const enrollmentPattern = /\b20\d{2}\/[A-Z]{2,4}\/\d{1,3}\b/;
      const enrollmentMatch = extractedText.match(enrollmentPattern);
      console.log(enrollmentMatch);
  
      if (enrollmentMatch) {
        res.status(200).send({
          success: true,
          extractedText: extractedText,
          enrollmentNumber: enrollmentMatch[0], // Return the first matched enrollment number
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Upload a clear photo of the ID",
        });
      }
    } catch (error) {
      console.error("Error processing image:", error.message);
      res.status(500).send({
        success: false,
        message: "Error processing image",
        error: error.message,
      });
    }
  });
  

module.exports = router;
