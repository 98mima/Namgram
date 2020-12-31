const path = require('path');

const express = require('express');

const commentController = require('../controllers/comment');

const router = express.Router();

router.post('/add', commentController.add);
router.get('/byPostId/:postId', commentController.getByPost);

module.exports = router;