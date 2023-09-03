const expressAsyncHandler = require("express-async-handler");
const authModel = require("../models/authModel");
const driveModel = require("../models/driveModel");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { SendMail } = require("../util/mailer");
const areMongoIdsValid = require("../validators/mongoIdValidator");

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
                    folderName:'parentFolder',
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
exports.login = expressAsyncHandler(
    async (req,res,next)=>{
        const {email,password} = req.body;
        if(!email && !password){
            return res.status(400).json({message:'Login Failed'});
        }
        const user = await authModel.findOne({email:email});
        if(!user){
            return res.status(400).json({message:'Login Failed'}); 
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:'Login Failed'});
        }
        user.password = '';
        return res.status(200).json({message:'Login Success',user});

    }
)
exports.userInfo = expressAsyncHandler(
    async (req,res,next)=>{
        const {userId} = req.params;
        if(!areMongoIdsValid([userId])){
            return res.status(400).json({message:'invalid ObjectId'})
        }
        const userDetails  = await authModel.findById(userId,{email:1});
        return res.json({message:'found user details',userDetails})
    }
)
