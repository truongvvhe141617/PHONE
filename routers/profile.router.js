const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');

router.get('/', profileController.profile)
router.post('/', profileController.update)


module.exports = router;
