
const RFQ = require("../models/rfq_model");
const QTN = require("../models/qtn_model");
const PO = require("../models/po_model");
const DO = require("../models/do_model");
const JCR = require("../models/jcr_model");
const INV = require("../models/inv_model");
const RV = require("../models/rv_model");
const RFQSTATUS = require("../models/rfq_status_model");
const CUSTOMER = require("../models/customer_model")

const project_controller = {
    projects_table:async (req,res)=>{
        
        let filter ={}
        if(req.query.rfq_status ){
            filter.rfq_status = req.query.rfq_status;
        }
        if(req.query.customer_name){
            filter.customer_name = req.query.customer_name;
        }
        let customer_list = await CUSTOMER.find({},'customer_name').lean();
        let total_rfqs = await RFQSTATUS.count();

        let page_number = req.query.page_number? req.query.page_number:0;
        let limit = 10;
        // let toatal_item = RFQSTATUS.count();
        RFQSTATUS.find(filter,{},{ skip: page_number*limit, limit: limit }).sort('-createdAt').lean().then((rfq_status_list)=>{
            let total_item =[];

            for(let i=0; i < total_rfqs /limit ; i++ ){
                total_item.push({
                    page_number: i,
                    current_page: page_number == i ? "true":"",
                });
            }
            
            res.render('projects/table', {rfq_list:rfq_status_list,customer_list,total_item, filter, heading:"PROJECT LIST"});
        }).catch(err =>{throw err})
       
    },
    newrfq_view:(req, res)=>{

        CUSTOMER.find({},"customer_name").lean().then(customer_list =>{
            console.log(customer_list);
            
            res.render('projects/newrfq',{customer_list} );
        })
       
    },
    newqtn_view:(req, res)=>{

        res.render('projects/newqtn', {rfq_number:req.query.rfq_number});
    },
    newpo_view:(req, res)=>{
        res.render('projects/newpo', {rfq_number:req.query.rfq_number});
    },
    newdo_view:(req, res)=>{
        res.render('projects/newdo', {rfq_number:req.query.rfq_number});
    },
    newjcr_view:(req, res)=>{
        res.render('projects/newjcr', {rfq_number:req.query.rfq_number});
    },
    newinvoice_view:(req, res)=>{
        res.render('projects/newinvoice', {rfq_number:req.query.rfq_number});
    },
    newpayment_view:(req, res)=>{
        res.render('projects/newpayment', {rfq_number:req.query.rfq_number});
    },
    newrfq_function:(req, res)=>{
        let newrfq = new RFQ({
            rfq_number: req.body.rfq_number,
            customer_name:req.body.customer_name,
            rfq_details: req.body.rfq_details,
            scheduled_qtn_date: req.body.scheduled_qtn_date,
            rfq_file_name:req.file? req.file.filename:"",
            rfq_creator:req.session.user ? req.session.user.user_name :""
        });
       
        let newrfqstatus = new RFQSTATUS({
            rfq_number: req.body.rfq_number,
            customer_name:req.body.customer_name,
            scheduled_qtn_date: req.body.scheduled_qtn_date,
            rfq_message:"RFQ Open",
            rfq_status:"open"

        });
        CUSTOMER.findOne({customer_name:req.body.customer_name}).then((data)=>{
            data.rfq_list.push(req.body.rfq_number);
            data.save();
        })
        newrfq.save(function(err) {
            if(err){
                    throw err;
                }
            newrfqstatus.save(function(err){
                if(err){
                    throw err
                }
                res.redirect("/projects")
            })
        });
        // let dateString = req.body.scheduled_qtn_date.toString();
        // var sc_date = new Date(dateString).toLocaleString();
        // var td_date = new Date().toLocaleString();
        // console.log(sc_date);
        // console.log(td_date)
        // console.log(sc_date > td_date);

        

    },
    newqtn_function:(req, res)=>{
        let newqtn = new QTN({
            qtn_number: req.body.qtn_number,
            qtn_details: req.body.qtn_details,
            qtn_file_name:req.file.filename,
            qtn_creator:req.session.user ? req.session.user.user_name :"",

        });
        const filter = {rfq_number:req.body.rfq_number}
        const data = {
            qtn_number: req.body.qtn_number,
            rfq_message:"Quotation submitted",
            rfq_status:"open"
        }
        newqtn.save(function(err) {
            if(err){
                throw err
            }
            RFQSTATUS.findOneAndUpdate(filter, data, (err)=>{
                console.log(err)
                res.redirect("/projects")
            })
            
        });
    },
    newpo_function:(req, res)=>{
        let newpo = new PO({
            po_number: req.body.po_number,
            po_details: req.body.po_details,
            scheduled_do_date:req.body.scheduled_do_date,
            scheduled_jcr_date:req.body.scheduled_jcr_date,
            po_file_name:req.file.filename,
            po_creator:req.session.user ? req.session.user.user_name :""
        });
        const filter = {rfq_number:req.body.rfq_number}
        const data = {
            po_number: req.body.po_number,
            scheduled_do_date:req.body.scheduled_do_date,
            scheduled_jcr_date:req.body.scheduled_jcr_date,
            rfq_message:"PO Recieved",
            rfq_status:"open"
        }
        newpo.save(function(err) {
            if(err){
                throw err
            }
            RFQSTATUS.findOneAndUpdate(filter, data, (err)=>{
                console.log(err)
                res.redirect("/projects")
            })
        });
    },
    newdo_function:(req, res)=>{
        let newdo = new DO({
            do_number: req.body.do_number,
            do_details: req.body.do_details,
            scheduled_jcr_date:req.body.scheduled_jcr_date,
            do_file_name:req.file.filename,
            do_creator:req.session.user ? req.session.user.user_name :""
        });
        const filter = {rfq_number:req.body.rfq_number}
        const data = {
            do_number: req.body.do_number,
            scheduled_do_date:"",
            scheduled_jcr_date:req.body.scheduled_jcr_date,
            rfq_message:"Material delivered",
            rfq_status:"open"
        }
        newdo.save(function(err) {
            if(err){
                throw err
            }
            RFQSTATUS.findOneAndUpdate(filter, data, (err)=>{
                console.log(err)
                res.redirect("/projects")
            })
        });
    },
    newjcr_function:(req, res)=>{
        let newjcr = new JCR({
            jcr_number: req.body.jcr_number,
            jcr_details: req.body.jcr_details,
            scheduled_inv_date:req.body.scheduled_inv_date,
            jcr_file_name:req.file.filename,
            jcr_creator:req.session.user ? req.session.user.user_name :""
        });
        const filter = {rfq_number:req.body.rfq_number}
        const data = {
            jcr_number: req.body.jcr_number,
            scheduled_inv_date:req.body.scheduled_inv_date,
            rfq_message:"JCR closed",
            rfq_status:"open"
        }
        newjcr.save(function(err) {
            if(err){
                throw err
            }
            RFQSTATUS.findOneAndUpdate(filter, data, (err)=>{
                console.log(err)
                res.redirect("/projects")
            })
        });
    },
    newinvoice_function:(req, res)=>{
        let newinv = new INV({
            inv_number: req.body.inv_number,
            inv_details: req.body.inv_details,
            payment_due_date:req.body.payment_due_date,
            inv_file_name:req.file.filename,
            inv_creator:req.session.user ? req.session.user.user_name :""
        });
        const filter = {rfq_number:req.body.rfq_number}
        const data = {
            inv_number: req.body.inv_number,
            payment_due_date:req.body.payment_due_date,
            rfq_message:"Invoice submitted",
            rfq_status:"open"
        }
        newinv.save(function(err) {
            if(err){
                throw err
            }
            RFQSTATUS.findOneAndUpdate(filter, data, (err)=>{
                res.session = req.session;
                console.log(err)
                res.redirect("/projects")
            })
        });
    },
    newpayment_function:(req, res)=>{
        let newrv = new RV({
            rv_number: req.body.rv_number,
            rv_details: req.body.rv_details,
            rv_file_name:req.file.filename,
            rv_creator:req.session.user ? req.session.user.user_name :""
        });
        const filter = {rfq_number:req.body.rfq_number}
        const data = {
            rv_number: req.body.rv_number,
            rfq_message:"Payment received",
            rfq_status:"completed"
        }
        newrv.save(function(err) {
            if(err){
                throw err
            }
            RFQSTATUS.findOneAndUpdate(filter, data, (err)=>{
                console.log(err)
                res.session = req.session;
                res.redirect("/projects")
            })
        });
    },
    rfq_details:async (req,res)=>{
        console.log(req.params.rfq_number);
        let rfq_status = await RFQSTATUS.findOne({rfq_number:req.params.rfq_number}).lean();
        let rfq_details = await RFQ.findOne({rfq_number:req.params.rfq_number}).lean();
        let qtn_details = await QTN.findOne({qtn_number:rfq_status.qtn_number}).lean();
        let po_details = await PO.findOne({po_number:rfq_status.po_number}).lean();
        let do_details = await DO.findOne({do_number:rfq_status.do_number}).lean();
        let jcr_details = await JCR.findOne({jcr_number:rfq_status.jcr_number}).lean();
        let inv_details = await INV.findOne({inv_number:rfq_status.inv_number}).lean();
        let rv_details = await RV.findOne({rv_number:rfq_status.rv_number}).lean();
        res.render("projects/rfqdetails", {rfq_heading:"RFQ-Details", rfq_details, qtn_details, po_details, do_details, jcr_details, inv_details, rv_details,rfq_status });
    },
    rfq_download:(req,res)=>{
        const file = `./public/uploads/rfq/${req.params.rfq_number}`;
        res.download(file);
    }
}

module.exports = project_controller;

function change_status(rfq) {
                        if(rfq.rfq_message == "RFQ Open"){
                            let dateString = rfq.scheduled_qtn_date.toString();
                            let pending_days = numberofdays(dateString);
                            if(pending_days <= 0){
                                rfq.rfq_status = "pending";
                                rfq.rfq_pending_days = Math.abs(pending_days);
                                RFQSTATUS.findOneAndUpdate({rfq_number: rfq.rfq_number}, {rfq_status:"pending", rfq_pending_days:pending_days},(err)=>{
                                    if(err){
                                        throw err
                                    }
                                });
                            }
                        }else if(rfq.rfq_message == "PO Recieved"){
                            let dateString;
                            if(rfq.scheduled_do_date){
                                dateString = rfq.scheduled_do_date.toString();
                            }else if(rfq.scheduled_jcr_date){
                                dateString = rfq.scheduled_jcr_date.toString();
                            }   
                            let pending_days = numberofdays(dateString);
                            if(pending_days <= 0){
                                rfq.rfq_status = "pending";
                                RFQSTATUS.findOneAndUpdate({rfq_number: rfq.rfq_number}, {rfq_status:"pending", rfq_pending_days:pending_days},(err)=>{
                                    if(err){
                                        throw err
                                    }
                                });
                                rfq.rfq_pending_days = Math.abs(pending_days);
                            }
                        }else if(rfq.rfq_message == "Material delivered"){
                            let dateString = rfq.scheduled_jcr_date.toString();
                            let pending_days = numberofdays(dateString);
                            if(pending_days <= 0){
                                rfq.rfq_status = "pending";
                                RFQSTATUS.findOneAndUpdate({rfq_number: rfq.rfq_number}, {rfq_status:"pending", rfq_pending_days:pending_days},(err)=>{
                                    if(err){
                                        throw err
                                    }
                                });
                                rfq.rfq_pending_days = Math.abs(pending_days);
                            }

                        }else if(rfq.rfq_message == "JCR closed"){
                            let dateString = rfq.scheduled_inv_date.toString();
                            let pending_days = numberofdays(dateString);
                            if(pending_days <= 0){
                                rfq.rfq_status = "pending";
                                RFQSTATUS.findOneAndUpdate({rfq_number: rfq.rfq_number}, {rfq_status:"pending", rfq_pending_days:pending_days},(err)=>{
                                    if(err){
                                        throw err
                                    }
                                });
                                rfq.rfq_pending_days = Math.abs(pending_days);
                            }
                        }else if(rfq.rfq_message == "Invoice submitted"){
                            let dateString = rfq.payment_due_date.toString();
                            let pending_days = numberofdays(dateString);
                            if(pending_days <= 0){
                                rfq.rfq_status = "pending";
                                RFQSTATUS.findOneAndUpdate({rfq_number: rfq.rfq_number},{rfq_status:"pending", rfq_pending_days:pending_days},(err)=>{
                                    if(err){
                                        throw err
                                    }
                                });
                                rfq.rfq_pending_days = Math.abs(pending_days);
                            }
                        }

}




function numberofdays(dateString) {
    let scheduled = new Date(dateString).getTime();
    let current = new Date().getTime();
    var Difference_In_Time = scheduled - current;
    var Difference_In_Days = Math.ceil((Difference_In_Time / (1000 * 3600 * 24))); 

    console.log(scheduled);
    console.log(current);
    console.log(Difference_In_Days);
    return Difference_In_Days;
}

function change_pending_days() {
    let current_time = new Date().getHours();
    if(current_time == 0){
        RFQSTATUS.find({},(err, doc)=>{
            if(err){
                throw err
            }
            console.log(current_time);
            
            doc.map((rfq)=>{
                if(rfq.rfq_status == "open"){
                    change_status(rfq);
                }else if(rfq.rfq_status == "pending"){
                    let pending_days = parseInt(rfq.rfq_pending_days) + 1;
                    if(rfq.rfq_pending_days){
                        RFQSTATUS.findOneAndUpdate({rfq_number: rfq.rfq_number},{rfq_pending_days:pending_days},(err)=>{
                            if(err){
                                throw err
                            }
                        });
                    }
                }
                
            })
        }) 
    }
    
}




var dayInMilliseconds = 1000 * 60 * 60 ;
//var dayInMilliseconds = 1000 * 30;
setInterval(function() { change_pending_days(); },dayInMilliseconds );
