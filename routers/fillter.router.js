const express = require('express');
const router = express.Router();

const fillterController = require('../controllers/fillter.controller');

router.get('/', fillterController.fillter)

module.exports = router;
