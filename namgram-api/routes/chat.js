const path = require('path');

const express = require('express');

const chatController = require('../controllers/chat');

const router = express.Router();

router.post('/join', chatController.joinChat);

module.exports = router;