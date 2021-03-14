var express = require('express');
var router = express.Router();
const customer_controller = require('../controllers/customer_controller')
const {sessionChecker, vat_upload} = require("../helper/helper")

router.get('/', customer_controller.customer_list);
router.get('/newcustomer', customer_controller.newcustomer_view);
router.post('/newcustomer', vat_upload.single("vat_cert"), customer_controller.newcustomer_function);

module.exports = router;

