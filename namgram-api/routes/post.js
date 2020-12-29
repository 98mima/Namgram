const path = require('path');

const express = require('express');

const postController = require('../controllers/post');

const router = express.Router();

router.get('/all', postController.getAll);
router.get('/byId/:id', postController.getByPerson);
router.get('/byPostId/:id', postController.getByPostId);
router.get('/byFollowings/:id', postController.getByFollowings);
// router.get('/getFollowing/:username', personController.getFollowing);
router.post('/add', postController.createPost);
router.post('/like', postController.like);
router.post('/dislike', postController.dislike);
router.delete('/delete', postController.deletePost);

module.exports = router;