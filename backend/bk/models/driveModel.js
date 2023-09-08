const mongoose = require('mongoose');

const driveModel = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    parentFolderId: mongoose.Schema.Types.ObjectId,
    folderName:{
        type:String
    },
    occupiedSpace: {
        type: Number, default: 0
    },
    files: [
        mongoose.Types.ObjectId
    ],
    nestedFolders: [
        {
            folderId: {
                type: mongoose.Types.ObjectId,

            },
        }
    ]
})
module.exports = mongoose.model('driveModel', driveModel);
