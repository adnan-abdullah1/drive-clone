const expressAsyncHandler = require("express-async-handler");
const driveModel = require("../models/driveModel");
const sharedFilesModel = require("../models/sharedFilesModel");
const mongoose = require('mongoose');
const areMongoIdsValid = require("../validators/mongoIdValidator");
const authModel = require("../models/authModel");
const { SendFilesSharedMail } = require("../util/mailer");

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
            return res.status(400).json({ message: 'file couldn\t be uploaded', data: {} })
        }
    }
)

exports.createFolder = expressAsyncHandler(
    async (req, res, next) => {
        const { parentFolderId } = req.params;
        if (!areMongoIdsValid([parentFolderId])) {
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        //check if parent folder is there
        const parentFolderExist =  await driveModel.findById(parentFolderId)
        if (!parentFolderExist) {
            return res.status(400).json({ message: 'Parent folder doesn\'t exist' });
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
    async (req, res, next) => {
        const {  folderId } = req.params;
        if (!areMongoIdsValid([parentFolderId, folderId])) {
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        const { canDeleteFolder } = await driveModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(folderId)
                }
            },
            {
                $project: {
                    childFoldersSize: {
                        "$size": "$nestedFolders"
                    },
                    filesSize: {
                        "$size": "$files"
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    canDeleteFolder: {
                        $cond: {
                            if: {
                                $or: [
                                    {
                                        $gt: ["$childFoldersSize", 0]
                                    },
                                    {
                                        $gt: ["$filesSize", 0]
                                    }
                                ]
                            },
                            then: false,
                            else: true
                        }
                    }
                }
            }
        ]);
        if (!canDeleteFolder) {
            return res.status(400).json({ message: "Folder can not be deleted, as it is not empy" })
        }
        const updatedParent = await driveModel.findByIdAndUpdate(parentFolderId, {
            $pull: {
                nestedFolders: {
                    "_id": new mongoose.Types.ObjectId(parentFolderId)
                }
            }
        })
        if (!updatedParent) {
            return res.status(400).json({ error: true, message: 'couldn\'t delete folder', data: {} });
        }
        const deletedFolder = await driveModel.findByIdAndDelete(folderId)
        if (!deletedFolder) {
            return res.status(400).json({ error: true, message: 'couldn\'t delete Folder', data: {} });
        }
        return res.status(400).json({ error: true, message: 'deleted Folder', data: {} });
    }
)


exports.shareFiles = expressAsyncHandler(
    async (req, res, next) => {
        const { ownerId, recipientUserId, fileId } = req.body;
        areMongoIdsValid([ownerId, recipientUserId, fileId])
        if (!(areMongoIdsValid([ownerId, recipientUserId, fileId], res))) {
            return res.status(400).json({ error: true, message: 'objectIds! are not valid', data: {} });
        }
        const fileAlreadyShared = await sharedFilesModel.findOne({ ownerId, recipientUserId, fileId })
        if (fileAlreadyShared) {
            return res.status(400).json({ message: 'File has been already shared', data: {} })
        }
        const data = new sharedFilesModel({
            ownerId, recipientUserId, fileId
        })
        const user = await authModel.findById(recipientUserId, { email: 1, _id: 0 })
        const savedSharedFile = data.save();
        if (savedSharedFile) {
            SendFilesSharedMail(user.email)
            return res.status(200).json({ message: 'resource shared with user ' })
        }
        else {
            return res.status(400).json({ message: 'Couldn\'t share file', data: {} })
        }

    }
)
