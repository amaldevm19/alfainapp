var express = require('express');
var router = express.Router();
const home_controller = require('../controllers/home_controller')


router.get('/', home_controller.home);
router.get('/api/v1', home_controller.home);

module.exports = router;
