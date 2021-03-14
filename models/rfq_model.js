const mongoose = require('mongoose');
const QTY = require('./qty_model')

const RfqSchema = new mongoose.Schema({
    rfq_number:{ type : String , unique : true, required : true},
    customer_name:String,
    rfq_details:String,
    scheduled_qtn_date:String,
    rfq_file_name:String,
    rfq_creator:String,
},{ timestamps: true });


RfqSchema.pre('save',()=>{
    QTY.findOne({year: new Date().getFullYear().toString()}).then(data =>{
        if(!data){
            let newqty = new QTY ({
                year:new Date().getFullYear().toString(),
                rfq_qty:[0,0,0,0,0,0,0,0,0,0,0,0]
            });
            newqty.rfq_qty[new Date().getMonth()] += 1;
            newqty.save();
        }else{
            data.rfq_qty[new Date().getMonth()] += 1;
            data.markModified('rfq_qty');
            data.save();
        }

    }).catch(err =>{
        console.log(err)
    })
})

module.exports = mongoose.model('RFQ', RfqSchema)