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
            parentFolderId: new mongoose.Types.ObjectId(parentFolderId),
            files: [],
            nestedFolders: []
        })
        const isFolderCreated = await newDriveFolder.save();
        if (!isFolderCreated) {
            return res.status(400).json({ error: true, message: 'couldn\'t create folder' })
        }
        //push entry in parentFolder
        const updatedParent = await driveModel.findByIdAndUpdate(parentFolderId, {
            $push: {
                nestedFolders: isFolderCreated._id
            }
        })
        return res.json({ error: false, message: 'folder is created', data: { isFolderCreated } });
    }
)
exports.deleteFolder = expressAsyncHandler(
    async (req,res,next) => {
        const {parentFolderId,folderId} = req.params;
        if(!areMongoIdsValid([parentFolderId,folderId])){
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        const updatedParent = await driveModel.findByIdAndUpdate(parentFolderId,{
            $pull:{
                nestedFolders : {
                    "_id": new mongoose.Types.ObjectId(parentFolderId)
                }
            }
        })
        if(!updatedParent){
            return res.status(400).json({ error: true, message: 'couldn\'t delete folder', data: {} });
        }
        const deletedFolder = await driveModel.findByIdAndDelete(folderId)
        if(!deletedFolder){
            return res.status(400).json({ error: true, message: 'couldn\'t delete Folder', data: {} });
        }
        return res.status(400).json({ error: true, message: 'deleted Folder', data: {} });
    }
)
