const path = require('path');

const express = require('express');

const commentController = require('../controllers/comment');

const router = express.Router();

router.get('/byPostId/:postId', commentController.getByPost);
router.get('/byImageId/:imageId', commentController.getByImage);
router.post('/add', commentController.add);
router.post('/addToImage', commentController.addToImage);

module.exports = router;