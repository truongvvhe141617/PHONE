const express = require('express');
const router = express.Router();

const orderedDetailController = require('../controllers/orderedDetail.controller');

router.get('/', orderedDetailController.orderedDetail)

module.exports = router;