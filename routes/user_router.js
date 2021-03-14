var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/user_controller')
const sessionChecker = require("../helper/helper")

router.get('/login', user_controller.login_form );
router.post('/login', user_controller.login_function);
router.get('/logout', user_controller.logout_function );
router.get('/signup', user_controller.signup_form );
router.post('/signup', user_controller.signup_function);

module.exports = router;
