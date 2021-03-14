var express = require('express');
var router = express.Router();
const project_controller = require('../controllers/project_controller');
const {rfq_upload, qtn_upload, po_upload, do_upload, jcr_upload, inv_upload, rv_upload} = require("../helper/helper")

router.get('/', project_controller.projects_table);
router.get('/newrfq', project_controller.newrfq_view);
router.get('/newqtn', project_controller.newqtn_view);
router.get('/newpo', project_controller.newpo_view);
router.get('/newdo', project_controller.newdo_view);
router.get('/newjcr', project_controller.newjcr_view);
router.get('/newinvoice', project_controller.newinvoice_view);
router.get('/newpayment', project_controller.newpayment_view);
router.post('/newrfq',rfq_upload.single("rfq_document"),project_controller.newrfq_function);
router.post('/newqtn',qtn_upload.single("qtn_document"), project_controller.newqtn_function);
router.post('/newpo',po_upload.single("po_document"), project_controller.newpo_function);
router.post('/newdo',do_upload.single("do_document"), project_controller.newdo_function);
router.post('/newjcr', jcr_upload.single("jcr_document"), project_controller.newjcr_function);
router.post('/newinvoice', inv_upload.single("inv_document"), project_controller.newinvoice_function);
router.post('/newpayment', rv_upload.single("rv_document"), project_controller.newpayment_function);
router.get('/rfq/:rfq_number', project_controller.rfq_details);
router.get('/download/rfq/:rfq_number', project_controller.rfq_download);

module.exports = router;
