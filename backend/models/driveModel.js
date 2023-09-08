const mongoose = require('mongoose');

const driveModel = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    parentFolderId: mongoose.Schema.Types.ObjectId,
    folderName: { type: String },
    occupiedSpace: {
        type: Number, default: 0
    },
    files: [
        {
            fileId: mongoose.Schema.Types.ObjectId, fileName: {
                type: String,unique:true
            }
        }
    ],
    nestedFolders: [
        {
            folderId: {
                type: mongoose.Types.ObjectId,
            },
            folderName:{
                type:String , unique: true
            }
        }
    ]
})
module.exports = mongoose.model('driveModel', driveModel);
