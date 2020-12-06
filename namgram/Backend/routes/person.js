const path = require('path');

const express = require('express');

const personController = require('../controllers/person');

const router = express.Router();

router.get('/all', personController.getAll);
router.post('/add', personController.addPerson);
router.delete('/delete', personController.deletePerson);

module.exports = router;