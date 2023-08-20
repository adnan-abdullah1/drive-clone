const expressAsyncHandler = require("express-async-handler");
const driveModel = require("../models/driveModel");
const mongoose = require('mongoose');
const areMongoIdsValid = require("../validators/mongoIdValidator");

exports.uploadData = expressAsyncHandler(
    async (req, res, next) => {
        const { userId, folderId } = req.params;
        const contentLengthInBytes = req.headers['content-length'] / 1024  //set size in KB

        if (!areMongoIdsValid([folderId, req.file?.id, userId])) {
            return res.status(400).json({ error: true, message: 'object Ids are not valid', data: {} });
        }
        const sizeUpdated = await driveModel.findOneAndUpdate({ userId }, {
            $inc: {
                'occupiedSpace': parseInt(contentLengthInBytes)
            }
        })
        if (sizeUpdated) {
            const newSavedFile = await driveModel.findByIdAndUpdate(new mongoose.Types.ObjectId(folderId),
                {
                    $push: {
                        files: req.file?.id
                    }
                })
            if (!newSavedFile) {
                return res.status(400).json({ message: 'file could not be uploaded ', data: {} })
            }
            return res.status(400).json({ message: 'file uploaded successfully', data: newSavedFile })
        }
        else {
            return res.status(400).json({ message: 'file couldn\t be uploaded', data: newSavedFile })
        }
    }
)

exports.createFolder = expressAsyncHandler(
    async (req, res, next) => {
        const { parentFolderId } = req.params;
        if (!areMongoIdsValid([parentFolderId])) {
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        let newDriveFolder = new driveModel({
            files: [],
            nestedFolders: []
        })
        const isFolderCreated = await newDriveFolder.save();
        return res.json({ error: false, message: 'folder is created' });
    }
)
