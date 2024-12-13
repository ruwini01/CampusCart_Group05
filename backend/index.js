require('dotenv').config({path: '.env'});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const port = process.env.PORT;
const boardingPost = require('./routes/boardingPost');
const bodyParser = require('body-parser');

app.use(express.json());


mongoose.connect(process.env.DB_PATH/*, { useNewUrlParser: true, useUnifiedTopology: true }*/)
    .then(() => {
        console.log("DB Connected to MongoBD Successfully");
    })
    .catch((err) => {
        console.error("Error connecting to mongoDB: ", err.message);
        process.exit(1); 
    });

//boarding post middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));   



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



