const path = require('path');
const express = require('express');
const imageController = require('../controllers/image');
const router = express.Router();

router.post('/add', imageController.add);

module.exports = router;