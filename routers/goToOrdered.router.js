const express = require('express');
const router = express.Router();

const goToOrderedController = require('../controllers/gotToOrdered.controller');

router.get('/', goToOrderedController.goToOrdered)

module.exports = router;