const mongoose = require('mongoose');
const QTY = require('./qty_model');

const DoSchema = new mongoose.Schema({
    do_number:{ type : String , unique : true, required : true},
    do_details:String,
    scheduled_jcr_date:String,
    do_file_name:String,
    do_creator:String
},{timestamps: true });

DoSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(data.do_qty.length == 0){
            data.do_qty = [0,0,0,0,0,0,0,0,0,0,0,0];
            data.do_qty[new Date().getMonth()] += 1;
            data.markModified('do_qty');
        }else{
            data.do_qty[new Date().getMonth()] += 1;
            data.markModified('do_qty');
        }
        data.save();
    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('DO', DoSchema)