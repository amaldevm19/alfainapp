const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customer_name:String,
    customer_address:String,
    customer_location:String,
    customer_vat:String,
    vat_cert:String,
    rfq_list:[String],
    customer_creator:String
},  { timestamps: true });

module.exports = mongoose.model('CUSTOMER', CustomerSchema)