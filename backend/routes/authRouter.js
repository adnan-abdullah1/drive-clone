
const express = require('express');
const router = express.Router();
let upload;
upload = require('../app')
const authController = require('../controller/authController');
const registerValidator = require('../validators/requestValidators');
// console.log(upload,'###')
router.route('/register')
    .post(registerValidator, authController.register)
router.route('/login')
    .post(authController.login)

router.route('/register')
    .post(() => { })

router.route('/user/:userId')
    .get(authController.userInfo)
router.route('/users/')
    .get(authController.usersList)


module.exports = router;

