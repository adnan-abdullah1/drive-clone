
const express = require('express');
require('module-alias/register')
require('dotenv').config({ path: './env/variables.env' })
const asyncHandler = require('express-async-handler')
const helmet = require('helmet');
const mongoose = require('mongoose');
const cloudinary = require("cloudinary");
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require("crypto");
const path = require("path");
const multer = require('multer')
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const { debug } = require('console');
const compression = require('compression')


let { CLOUDINARY_URL, CLOUDINARY_SECRET, CLOUDINARY_DB, PORT, CLOUDINARY_APIKEY, MONGO_URL } = process.env
const app = express();


app.use(helmet())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false
        }
        // fallback to standard filter function
        return compression.filter(req, res)
    }
}))
// app.set('view engine', 'ejs'); // Set the default view engine
// app.set('views', 'views');
//mongoose connection 
const mnogooseConnection = mongoose.connect(`${MONGO_URL}`);
mnogooseConnection.
    then((con) => console.log('****mongoose connected****'))
    .catch(error => console.log('mongoose failed to connect'));

mongoose.connection.on('error', err => {
    console.log(err);
});
app.get('env') == 'development' ? mongoose.set('debug', true) : mongoose.set(debug, false)
mongoose.connection.on('connected', () => {
    let db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads"
    });


});
//gridfs sotrage

const storage = new GridFsStorage({
    url: `${MONGO_URL}`, file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = `${file.originalname}!/!.$@${buf.toString('hex')}${path.extname(file.originalname)}`;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});


exports.upload = multer({ storage, dest: '/uploads' })

//cloudinary settings 
cloudinary.config({
    cloud_name: CLOUDINARY_DB,
    api_key: CLOUDINARY_APIKEY,
    api_secret: CLOUDINARY_SECRET
});



// app.use('/api/v1/drive', require('@Route/driveRouter'));
// app.use('/api/v1/auth', require('@Route/authRouter'));
app.get('/', (req, res, next) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Drive App</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
    
            .container {
                width: 80%;
                margin: auto;
                overflow: hidden;
            }
    
            header {
                background-color: #35424a;
                color: white;
                padding: 20px 0;
            }
    
            header a {
                color: white;
                text-decoration: none;
                text-transform: uppercase;
                font-size: 16px;
                margin: 0 20px;
            }
    
            header ul {
                padding: 0;
                margin: 0;
                list-style: none;
                overflow: hidden;
                display: inline;
            }
    
            header li {
                float: left;
                display: inline;
                padding: 0 20px 0 20px;
            }
    
            .landing {
                text-align: center;
                padding: 100px 0;
            }
    
            .landing h1 {
                font-size: 50px;
                margin-bottom: 20px;
            }
    
            .landing p {
                font-size: 18px;
                color: #777;
            }
    
            .cta-button {
                display: inline-block;
                background-color: #e8491d;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                font-size: 18px;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s;
            }
    
            .cta-button:hover {
                background-color: #d6360b;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <div id="branding">
                    <h1><span class="highlight">Drive</span> App</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        <section class="landing">
            <div class="container">
                <h1>Your Ultimate Cloud Storage Solution</h1>
                <p>Securely store and access your files from anywhere, anytime.</p>
                <a href="#" class="cta-button">Get Started</a>
            </div>
        </section>
    </body>
    </html>
    `)
})
// const result = cloudinary.uploader.upload('./1.png')
// result.then((any)=>console.log(any))



// Start the server
if (app.get('env') === 'development') {

}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



