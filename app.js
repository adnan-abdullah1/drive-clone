
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



app.use('/api/v1/drive', require('@Route/driveRouter'));
app.use('/api/v1/auth', require('@Route/authRouter'));
app.get('/', (req, res, next) => {
    res.send('<h1>hello wolrd!!! this is drive clone</h1>')
})
// const result = cloudinary.uploader.upload('./1.png')
// result.then((any)=>console.log(any))



// Start the server
if (app.get('env') === 'development') {

}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



