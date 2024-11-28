const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;


const DB_PATH = "mongodb+srv://campuscart05:hCvRp64pRLfIrgfi@cluster0.j4rvj.mongodb.net/campuscart"; 

mongoose.connect(DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })
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
