
const express = require('express');
const router = express.Router();
let upload ;
upload=require('../app')
const driveController = require('../controller/authController');
const registerValidator = require('../validators/requestValidators');
// console.log(upload,'###')
router.route('/register')
    .post(registerValidator,driveController.register)
router.route('/login')
    .post(driveController.login)

router.route('/register')
    .post(()=>{})
    



module.exports = router;

