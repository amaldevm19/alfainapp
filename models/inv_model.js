const mongoose = require('mongoose');
const QTY = require('./qty_model');

const InvSchema = new mongoose.Schema({
    inv_number:String,
    inv_details:String,
    payment_due_date:String,
    inv_file_name:String,
    inv_creator:String
}, { timestamps: true });

InvSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(data.inv_qty.length == 0){
            data.inv_qty = [0,0,0,0,0,0,0,0,0,0,0,0];
            data.inv_qty[new Date().getMonth()] += 1;
            data.markModified('inv_qty');
        }else{
            data.inv_qty[new Date().getMonth()] += 1;
            data.markModified('inv_qty');
        }
        data.save();
    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('INV', InvSchema)