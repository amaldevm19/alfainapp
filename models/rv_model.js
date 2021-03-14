const mongoose = require('mongoose');
const QTY = require('./qty_model');

const RvSchema = new mongoose.Schema({
    rv_number:String,
    rv_details:String,
    rv_file_name:String,
    rv_creator:String
},  { timestamps: true });

RvSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(data.rv_qty.length == 0){
            data.rv_qty = [0,0,0,0,0,0,0,0,0,0,0,0];
            data.rv_qty[new Date().getMonth()] += 1;
            data.markModified('rv_qty');
        }else{
            data.rv_qty[new Date().getMonth()] += 1;
            data.markModified('rv_qty');
        }
        data.save();
    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('RV', RvSchema)