const mongoose = require('mongoose');

const RfqStatusSchema = new mongoose.Schema({
    rfq_number:String,
    customer_name:String,
    scheduled_qtn_date:String,
    qtn_number:String,
    po_number:String,
    scheduled_do_date:String,
    do_number:String,
    scheduled_jcr_date:String,
    jcr_number:String,
    scheduled_inv_date:String,
    inv_number:String,
    payment_due_date:String,
    rv_number:String,
    rfq_message:String,
    rfq_status:String,
    rfq_pending_days:String,
},{timestamps: true});

module.exports = mongoose.model('RFQSTATUS', RfqStatusSchema)