const mongoose = require('mongoose');
const QTY = require('./qty_model');

const QtnSchema = new mongoose.Schema({
    qtn_number:String,
    qtn_details:String,
    qtn_file_name:String,
    qtn_creator:String
},  { timestamps: true });

QtnSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(data.qtn_qty.length == 0){
            data.qtn_qty = [0,0,0,0,0,0,0,0,0,0,0,0];
            data.qtn_qty[new Date().getMonth()] += 1;
            data.markModified('qtn_qty');
        }else{
            data.qtn_qty[new Date().getMonth()] += 1;
            data.markModified('qtn_qty');
        }
        data.save();
    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('QTN', QtnSchema)