const express = require('express');
const router = express.Router();

const verifyEmailController = require('../controllers/verifyEmail.controller');

router.get('/', verifyEmailController.get)
router.post('/', verifyEmailController.post)

module.exports = router;
