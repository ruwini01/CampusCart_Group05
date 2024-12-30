require('dotenv').config({path: '.env'});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require("path");
const cors = require('cors');
const port = process.env.PORT;
const bodyParser = require('body-parser');


const userRoute = require('./routes/userRoute');
const verifyRoute = require('./routes/verifyRoute');
const boardingPostsRoute = require('./routes/bordingPostsRoute');
const sellpostsRoute = require('./routes/sellPostsRoute');


app.use(express.json());
app.use(cors({
    origin: '*', // Be more specific in production
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
  }));

app.use('/users', userRoute);
app.use('/verify', verifyRoute);
app.use('/boardingposts',boardingPostsRoute);
app.use('/sellposts', sellpostsRoute);


mongoose.connect(process.env.DB_PATH/*, { useNewUrlParser: true, useUnifiedTopology: true }*/)
    .then(() => {
        console.log("DB Connected to MongoBD Successfully");
    })
    .catch((err) => {
        console.error("Error connecting to mongoDB: ", err.message);
        process.exit(1); 
    });


app.get("/", (req,res) => {
    res.send("Express App is Running");
})


app.listen(port, (error) => {
    if(!error){
    console.log(`Server running at port:${port}`);
    }
    else{
        console.log("Error: "+error);     
    }
});


// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({ 
    storage: storage,
    //limits: { fileSize: 5 * 1024 * 1024 },
 });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('post'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://172.20.10.2:${port}/images/${req.file.filename}`
    });
});



