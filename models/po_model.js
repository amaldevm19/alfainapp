const mongoose = require('mongoose');
const QTY = require('./qty_model');

const PoSchema = new mongoose.Schema({
    po_number:String,
    po_details:String,
    scheduled_do_date:String,
    scheduled_jcr_date:String,
    po_file_name:String,
    po_creator:String
},  { timestamps: true });

PoSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(data.po_qty.length == 0){
            data.po_qty = [0,0,0,0,0,0,0,0,0,0,0,0];
            data.po_qty[new Date().getMonth()] += 1;
            data.markModified('po_qty');
        }else{
            data.po_qty[new Date().getMonth()] += 1;
            data.markModified('po_qty');
        }
        data.save();
    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('PO', PoSchema)