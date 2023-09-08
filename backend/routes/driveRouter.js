const router = require('express').Router({ mergeParams: true });;

let {upload} = require('../app')



const driveController = require('../controller/driveController')
// console.log(upload,'###')
router.route('/create-folder/:parentFolderId')
        .post(driveController.createFolder);
router.route('/delete-folder/:folderId')
        .delete(driveController.deleteFolder)
router.route('/rename-folder/:folderId')
        .put(driveController.renameFolder)
router.route('/:folderId/:userId')
        .get()
        .post(
                upload.single('file'),
                driveController.uploadData)
router.route('/:userId/:resourceId')
        .delete((req, res, next) => { next(); }, () => { res.send("hiiii@@@@@@@@@") })
        .put(() => { })
router.route('/share-files')
                .post(driveController.shareFiles)
router.route('/folder/:folderId')
                .get(driveController.getFolder)



module.exports = router;

