const router = require('express').Router({mergeParams:true});;

let upload ;

upload=require('../app')

    
const driveController = require('../controller/driveController')
// console.log(upload,'###')
router.route('/create-folder/:parentFolderId')
        .post(driveController.createFolder);
router.route('/folder/:parentFolderId/:forlderId')
        .delete(driveController.deleteFolder)
router.route('/:folderId/:userId')
    .get()
    .post(
        upload.single('file'),
        driveController.uploadData)
router.route('/:userId/:resourceId')
    .delete((req, res, next) => {  next(); }, () => { res.send("hiiii@@@@@@@@@") })
    .put(() => { })



module.exports = router;

