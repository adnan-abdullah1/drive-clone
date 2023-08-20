const mongoose = require('mongoose');

const driveModel = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    occupiedSpace: {
        type: Number, default: 0
    },
    files: [
        {
            fileId: mongoose.Types.ObjectId,

        },
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
