var express = require('express');
var router = express.Router();
const api_controller = require('../controllers/api_controller')

router.get('/projects/overall', api_controller.projects_overall);
router.post('/projects/yearly', api_controller.projects_yearly);
router.get('/projects/rfq_status', api_controller.projects_rfq_status);
router.get('/projects/qtn_status', api_controller.projects_qtn_status);
router.get('/projects/po_status', api_controller.projects_po_status);
router.get('/projects/inv_status', api_controller.projects_inv_status);
router.post('/projects/new_rfq', api_controller.projects_new_rfq);
router.post('/projects/new_qtn', api_controller.projects_new_qtn);
router.post('/projects/new_po', api_controller.projects_new_po);
router.post('/projects/new_do', api_controller.projects_new_do);
router.post('/projects/new_jcr', api_controller.projects_new_jcr);
router.post('/projects/new_inv', api_controller.projects_new_inv);
router.post('/projects/new_rv', api_controller.projects_new_rv);

module.exports = router;
