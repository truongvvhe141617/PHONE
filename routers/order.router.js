const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');

router.get('/', orderController.get)
router.post('/', orderController.post);

module.exports = router;