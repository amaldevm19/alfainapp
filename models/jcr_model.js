const mongoose = require('mongoose');
const QTY = require('./qty_model');

const JcrSchema = new mongoose.Schema({
    jcr_number:String,
    jcr_details:String,
    scheduled_inv_date:String,
    jcr_file_name:String,
    jcr_creator:String
}, { timestamps: true });

JcrSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(data.jcr_qty.length == 0){
            data.jcr_qty = [0,0,0,0,0,0,0,0,0,0,0,0];
            data.jcr_qty[new Date().getMonth()] += 1;
            data.markModified('jcr_qty');
        }else{
            data.jcr_qty[new Date().getMonth()] += 1;
            data.markModified('jcr_qty');
        }
        data.save();
    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('JCR', JcrSchema)