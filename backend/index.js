require('dotenv').config({path: '.env'});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const port = process.env.PORT;
const boardingPost = require('./routes/boardingPost');
const bodyParser = require('body-parser');



mongoose.connect(process.env.DB_PATH/*, { useNewUrlParser: true, useUnifiedTopology: true }*/)
    .then(() => {
        console.log("DB Connected to MongoBD Successfully");
    })
    .catch((err) => {
        console.error("Error connecting to mongoDB: ", err.message);
        process.exit(1); 
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));   
app.use('/api/boardingPost', boardingPost);


app.listen(port, () => {
    console.log(`Server running at port:${port}`);
});


// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});
