const mongoose = require('mongoose');

const QtySchema = new mongoose.Schema({
    year:String,
    rfq_qty:[Number],
    qtn_qty:[Number],
    po_qty:[Number],
    do_qty:[Number],
    jcr_qty:[Number],
    inv_qty:[Number],
    rv_qty:[Number]
},  { timestamps: true });

module.exports = mongoose.model('QTY', QtySchema)