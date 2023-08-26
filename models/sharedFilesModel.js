const mongoose = require('mongoose');

const sharedFilesModel = new mongoose.Schema({
    ownerId: { //person who owns files
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    recipientUserId: { //person whom with file has been shared
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    hasExpiry: {
        type: Boolean, default: false
    },
    expiryDate: {
        type: Date, default: undefined
    }
})
module.exports = mongoose.model('sharedFiles', sharedFilesModel)
