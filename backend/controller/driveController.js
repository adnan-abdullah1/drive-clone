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
        const contentLengthInBytes = req.headers['content-length'] / 1024  //set size in KB;
        const isParentFolder = req.query.isParentFolder === 'true';
        console.log(req.params, req.file)
        if (!areMongoIdsValid([folderId, req.file?.id, userId])) {
            return res.status(400).json({ error: true, message: 'object Ids are not valid', data: {} });
        }
        let query;
        if (isParentFolder) {
            query = { userId: new mongoose.Types.ObjectId(folderId) }
        }
        else {
            query = {
                _id: new mongoose.Types.ObjectId(folderId)
            }
        }
        const sizeUpdated = await driveModel.findOneAndUpdate({ userId: new mongoose.Types.ObjectId(userId) }, {
            $inc: {
                'occupiedSpace': parseInt(contentLengthInBytes)
            }
        })
        if (sizeUpdated) {
            const newSavedFile = await driveModel.findOneAndUpdate(query,
                {
                    $push: {
                        files: {
                            fileId: req.file.id,
                            fileName: req.file.originalname
                        }
                    }
                }, { uspsert: true })
            if (!newSavedFile) {
                return res.status(400).json({ message: 'file could not be uploaded ', data: {} })
            }
            return res.status(200).json({ message: 'file uploaded successfully', data: newSavedFile })
        }
        else {
            return res.status(400).json({ message: 'file couldn\t be uploaded', data: {} })
        }
    }
)
exports.renameFile = expressAsyncHandler(
    async (req, res, next) => {
        const { userId, folderId } = req.params;
        const { fileName } = req.body;
        const isParentFolder = req.query.isParentFolder === 'true';
        console.log(req.params, req.file)
        if (!areMongoIdsValid([folderId, userId])) {
            return res.status(400).json({ error: true, message: 'object Ids are not valid', data: {} });
        }
        let query;
        if (isParentFolder) {
            query = { userId: new mongoose.Types.ObjectId(folderId) }
        }
        else {
            query = {
                _id: new mongoose.Types.ObjectId(folderId)
            }
        }
        const deleteFile = await driveModel.findOneAndUpdate(query,
            {
                $pull: {
                    files: {
                        "fileId": new mongoose.Types.ObjectId(fileId)
                    }
                }
            })
        if (!deleteFile)
            return res.status(400).json({ message: 'file could not be uploaded ', data: {} })

        const addRenamedFile = await driveModel.findOneAndUpdate(query,
            {
                $push: {
                    files: { fileId: fileId, fileName: fileName }
                }
            })
        return res.status(200).json({ message: 'file uploaded successfully', })
    }
)

exports.createFolder = expressAsyncHandler(
    async (req, res, next) => {
        const { parentFolderId } = req.params;
        const isParentFolder = req.query.isParentFolder === 'true'
        const { folderName } = req.body;
        if (!areMongoIdsValid([parentFolderId])) {
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        //check if parent folder is there
        const parentFolderExist = await driveModel.findById(parentFolderId)
        if (!parentFolderExist && !isParentFolder) {
            return res.status(400).json({ message: 'Parent folder doesn\'t exist' });
        }
        let newDriveFolder
        try {

            newDriveFolder = new driveModel({
                parentFolderId: parentFolderId,
                folderName: folderName,
                files: [],
                nestedFolders: []
            })
        }
        catch (err) {
            console.log(err)
        }
        const isFolderCreated = await newDriveFolder.save();
        if (!isFolderCreated) {
            return res.status(400).json({ error: true, message: 'couldn\'t create folder' })
        }
        //push entry in 
        let query;
        if (isParentFolder) {
            query = { userId: parentFolderId }
        }
        else {
            query = { _id: parentFolderId }
        }
        const updatedParent = await driveModel.findOneAndUpdate(query, {
            $push: {
                nestedFolders: { folderId: isFolderCreated._id, folderName: folderName }
            }
        })
        return res.json({ error: false, message: 'folder is created', data: { isFolderCreated } });
    }
)
exports.deleteFolder = expressAsyncHandler(
    async (req, res, next) => {
        let { folderId } = req.params;
        const isParentFolder = req.query.isParentFolder === 'true'
        if (!areMongoIdsValid([folderId])) {
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        folderId = new mongoose.Types.ObjectId(folderId)
        const folder = await driveModel.findById(folderId, { parentFolderId: 1 })
        const parentFolderId = folder.parentFolderId
        let query;
        if (isParentFolder) {
            query = { userId: new mongoose.Types.ObjectId(parentFolderId) }
        }
        else
            query = { _id: new mongoose.Types.ObjectId(parentFolderId) }
        const folderInfo = await driveModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(folderId)
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
        if (!folderInfo[0].canDeleteFolder) {
            return res.status(400).json({ message: "Folder can not be deleted, as it is not empy" })
        }
        const updatedParent = await driveModel.findOneAndUpdate(query, {
            $pull: {
                nestedFolders: {
                    "folderId": folderId
                }
            }
        })
        if (!updatedParent) {
            return res.status(400).json({ error: true, message: 'couldn\'t delete folder', data: {} });
        }
        const deletedFolder = await driveModel.findOneAndDelete(folderId)
        if (!deletedFolder) {
            return res.status(400).json({ error: true, message: 'couldn\'t delete Folder', data: {} });
        }
        return res.json({ error: false, message: 'deleted Folder', data: {} });
    }
)
exports.renameFolder = expressAsyncHandler(
    async (req, res, next) => {
        const { folderId } = req.params;
        const isParentFolder = req.query.isParentFolder === 'true';
        const { folderName } = req.body;
        if (!areMongoIdsValid([folderId])) {
            return res.status(400).json({ error: true, message: 'object Id is not valid', data: {} });
        }
        if (!folderName) {
            return res.status(400).json({ message: 'folder name is missing' });
        }
        const folder = await driveModel.findById(folderId, { parentFolderId: 1 })
        const parentFolderId = folder.parentFolderId;
        let query;
        if (isParentFolder) {
            { userId: folderId }
        }
        else {
            { _id: folderId }
        }
        const removedFromParent = await driveModel.findOneAndUpdate(query, {

            $pull: {
                nestedFolders: {
                    folderId: new mongoose.Types.ObjectId(folderId)
                }
            },

        })
        const pushedToParent = await driveModel.findOneAndUpdate(query, {
            $push: {
                nestedFolders: {
                    folderId: new mongoose.Types.ObjectId(folderId),
                    folderName: folderName
                }
            }
        })
        if (!(removedFromParent && pushedToParent)) {
            return res.status(400).json({ error: true, message: 'couldn\'t rename folder', data: {} });
        }
        const deletedFolder = await driveModel.findByIdAndUpdate(folderId, {
            $set: {
                folderName: folderName
            }
        })
        if (!deletedFolder) {
            return res.status(400).json({ error: true, message: 'couldn\'t rename Folder', data: {} });
        }
        return res.json({ error: false, message: 'Renamed Folder', data: {} });
    }
)

exports.getFolder = expressAsyncHandler(
    async (req, res, next) => {
        const { folderId } = req.params;
        let { isParentFolder } = req.query
        if (!areMongoIdsValid([folderId])) {
            return res.status(400).json({ error: true, message: 'objectIds! are not valid', data: {} });
        }
        let folder;
        if (isParentFolder == 'true')
            folder = await driveModel.findOne({ userId: new mongoose.Types.ObjectId(folderId) })
        else
            folder = await driveModel.findById(folderId)
        return res.json({ message: 'data found', folder })
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
