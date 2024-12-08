require('dotenv').config({path: '.env'});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const port = process.env.PORT;


mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB Connected Successfully");

        app.listen(port, () => {
            console.log(`Server running at port:${port}`);
        });
    })
    .catch((err) => {
        console.error("DB Connection Error: ", err.message);
        process.exit(1); 
    });
