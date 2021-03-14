
const CUSTOMER = require("../models/customer_model");
const RFQSTATUS = require("../models/rfq_status_model");

const customer_controller = {
    newcustomer_view:(req,res)=>{
        res.render('customers/newcustomer');
    },
    newcustomer_function:(req,res)=>{
        let newcustomer = new CUSTOMER({
            customer_name:req.body.customer_name,
            customer_address:req.body.customer_address,
            customer_location:req.body.customer_location,
            customer_vat:req.body.customer_vat,
            vat_cert:req.file.filename,
            rfq_list:[],
            customer_creator:req.session.user ? req.session.user.user_name :""
        })

        newcustomer.save().then(()=>{
            res.redirect('/customers');
        }).catch(err => {throw err})
       
    },
    customer_list: (req,res)=>{
        CUSTOMER.find().lean().then((customer_list)=>{
            res.render('customers/customerlist', {customer_list, heading:"CUSTOMER LIST"});
        }).catch(err=>{throw err});
        
    }
}

module.exports = customer_controller;