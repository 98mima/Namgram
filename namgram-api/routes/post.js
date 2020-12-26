const path = require('path');

const express = require('express');

const postController = require('../controllers/post');

const router = express.Router();

router.get('/all', postController.getAll);
router.get('/byId/:username', postController.getByPerson);
// router.get('/byEmail/:email', personController.getByEmail);
// router.get('/byUsername/:username', personController.getByUsername);
// router.get('/getFollowing/:username', personController.getFollowing);
// router.get('/getFollowers/:username', personController.getFollowers);
// router.post('/follow', personController.follow);
// router.delete('/unfollow', personController.unfollow);
// router.delete('/delete', personController.deletePerson);

module.exports = router;