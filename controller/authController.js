const expressAsyncHandler = require("express-async-handler");
const authModel = require("../models/authModel");
const driveModel = require("../models/driveModel");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { SendMail } = require("../util/mailer");

const SALT_ROUNDS = 10;
exports.register = expressAsyncHandler(
    async (req, res, next) => {
        try {
            const { password, email } = req.body;
            //has password
            const salt = await bcrypt.genSalt(SALT_ROUNDS)
            const hashedPassword = await bcrypt.hash(password, salt)
            // const session = await mongoose.startSession()
            //create model
            const newUser = new authModel({
                password: hashedPassword,
                email
            });
            const savedNewUser = await newUser.save();
            if (savedNewUser) {
                //make entry in drive//
                let newDriveSpace = new driveModel({
                    userId: savedNewUser._id,
                    files: [],
                    nestedFolders: []
                })
                const allocatedDrive = await newDriveSpace.save();
                if (allocatedDrive) {
                    savedNewUser['password'] = null
                    SendMail(email)
                    res.status(200).json({ message: 'user created successfully', data: { savedNewUser, allocatedDrive } });
                }
                else {
                    throw new Error('failed to create drive space')
                }
            }
            else {
                throw new Error('failed to create drive space')
            }
            // session.commitTransaction();
            // session.endSession()

        }
        catch (err) {
            // await session.abortTransaction();
            res.status(400).json({ message: err.message, data: {} })
        }

    }
)
