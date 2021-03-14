const RFQ = require("../models/rfq_model");
const QTN = require("../models/qtn_model");
const PO = require("../models/po_model");
const DO = require("../models/do_model");
const JCR = require("../models/jcr_model");
const INV = require("../models/inv_model");
const RV = require("../models/rv_model");
const QTY = require("../models/qty_model");
const RFQSTATUS = require("../models/rfq_status_model");
const CUSTOMER = require("../models/customer_model")

const api_controller = {
  projects_overall:async (req,res)=>{
        //const total_quantity = {};
        let rfq_count = await RFQ.count();
        let qtn_count = await QTN.count();
        let po_count = await PO.count();
        let do_count = await DO.count();
        let jcr_count = await JCR.count();
        let inv_count = await INV.count();
        let rv_count = await RV.count();
        var data = {
            labels: ["RFQ", "Quotation", "PO", "DO", "JCR", "Invoice", "RV"],
            datasets: [
              {
                label: "Overall Project Staticstics",
                data: [rfq_count, qtn_count, po_count, do_count, jcr_count, inv_count, rv_count],
                backgroundColor: ["#8e24aa","#3f51b5","#009688","#cddc39","#76ff03","#F4A460","#2E8B57"],
                borderColor: ["#8e24aa","#3f51b5","#009688","#cddc39","#76ff03","#F4A460","#2E8B57"],
                borderWidth: [1, 1, 1, 1, 1]
              }
            ]
          };
        res.send(data);
    },
  projects_yearly:async (req,res)=>{
      QTY.findOne({year:req.body.year}).lean().then(data=>{
        let datasets = [
          {
            label: "RFQ",
            backgroundColor: "#8e24aa",
            data: data?data.rfq_qty:[],
          }, 
          {
            label: "Quotation",
            backgroundColor: "#3f51b5",
            data: data?data.qtn_qty:[],
          }, 
          {
            label: "PO",
            backgroundColor: "#009688",
            data: data?data.po_qty:[],
          }, 
          {
            label: "DO",
            backgroundColor: "#cddc39",
            data: data?data.do_qty:[],
          }, 
          {
            label: "JCR",
            backgroundColor: "#76ff03",
            data: data?data.jcr_qty:[],
          }, 
          {
            label: "Invoice",
            backgroundColor: "#F4A460",
            data: data?data.inv_qty:[],
          }, 
          {
            label: "Payment",
            backgroundColor: "#2E8B57",
            data: data?data.rv_qty:[],
          }
        ]
        res.send(datasets);
      }).catch(err=>{
        console.log(err);
      })
  },
  projects_rfq_status:async (req,res)=>{
    let open_rfq_qty = await RFQSTATUS.find({rfq_message:"RFQ Open", rfq_status:"open"}).count();
    let pending_rfq_qty = await RFQSTATUS.find({rfq_message:"RFQ Open", rfq_status:"pending"}).count();
    let completed_rfq_qty = await RFQSTATUS.find({rfq_message:{$ne:"RFQ Open"}}).count();
    var data = {
      labels: [`RFQ Received-${open_rfq_qty}`, `QTN pending-${pending_rfq_qty}`, `QTN submitted-${completed_rfq_qty}`],
      datasets: [
        {
          label: "RFQ Status",
          data: [open_rfq_qty, pending_rfq_qty, completed_rfq_qty],
          backgroundColor: ["#8e24aa","#F4A460","#009688"],
          borderColor: ["#8e24aa","#F4A460","#009688"],
          borderWidth: [1, 1, 1,]
        }
      ]
    };
    res.send(data);

  },
  projects_qtn_status:async (req,res)=>{
    let open_qtn_qty = await RFQSTATUS.find({rfq_message:"Quotation submitted", rfq_status:"open"}).count();
    let completed_qtn_qty = await RFQSTATUS.find({rfq_message:{$nin:["RFQ Open","Quotation submitted"]}}).count();
    var data = {
      labels: ["Quotation submitted", "PO Received"],
      datasets: [
        {
          label: "Quotation Status",
          data: [open_qtn_qty, completed_qtn_qty],
          backgroundColor: ["#8e24aa","#009688"],
          borderColor: ["#8e24aa","#009688"],
          borderWidth: [1, 1, ]
        }
      ]
    };
    res.send(data);
  },
  projects_po_status:async (req,res)=>{
    let open_po_qty = await RFQSTATUS.find({rfq_message:"PO Recieved", rfq_status:"open"}).count();
    let pending_do_qty = await RFQSTATUS.find({rfq_message:"PO Recieved", rfq_status:"pending"}).where('scheduled_do_date').ne("").count();
    let pending_jcr_qty = ( await RFQSTATUS.find({rfq_message:"Material delivered", rfq_status:"pending"}).count() + 
                            await RFQSTATUS.find({rfq_message:"Material delivered", rfq_status:"open"}).count() +
                            await RFQSTATUS.find({rfq_message:"PO Recieved", rfq_status:"pending"}).where('scheduled_do_date').equals("").count()) ;
    
    let work_completed_qty = await RFQSTATUS.find({rfq_message:{$nin:["RFQ Open","Quotation submitted", "PO Recieved", "Material delivered"]}}).count();
    var data = {
      labels: ["PO Received", "DO pending", "JCR pending", "JCR completed"],
      datasets: [
        {
          label: "Work Execution Status",
          data: [open_po_qty, pending_do_qty, pending_jcr_qty, work_completed_qty],
          backgroundColor: ["#8e24aa","#F4A460","#cddc39","#009688"],
          borderColor: ["#8e24aa","#F4A460","#cddc39","#009688"],
          borderWidth: [1, 1,1,1, ]
        }
      ]
    };
    res.send(data);
  },
  projects_inv_status:async (req,res)=>{
    let invoice_submitted = await RFQSTATUS.find({rfq_message:"Invoice submitted", rfq_status:"open"}).count();
    let pending_invoice = await RFQSTATUS.find({rfq_message:"Invoice submitted", rfq_status:"pending"}).count();    
    let payment_received = await RFQSTATUS.find({rfq_status:"completed"}).count();
    var data = {
      labels: ["Invoice just Submitted", "Over due payment", "Payment received"],
      datasets: [
        {
          label: "Invoice Status",
          data: [invoice_submitted, pending_invoice, payment_received],
          backgroundColor: ["#8e24aa","#F4A460","#009688"],
          borderColor: ["#8e24aa","#F4A460","#009688"],
          borderWidth: [1, 1,1, ]
        }
      ]
    };
    res.send(data);
  },
  projects_new_rfq:async(req,res)=>{
    RFQ.findOne({rfq_number:req.body.rfq_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  },
  projects_new_qtn:async(req,res)=>{
    QTN.findOne({qtn_number:req.body.qtn_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  },
  projects_new_po:async(req,res)=>{
    PO.findOne({po_number:req.body.po_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  },
  projects_new_do:async(req,res)=>{
    DO.findOne({do_number:req.body.do_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  },
  projects_new_jcr:async(req,res)=>{
    JCR.findOne({jcr_number:req.body.jcr_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  },
  projects_new_inv:async(req,res)=>{
    INV.findOne({inv_number:req.body.inv_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  },
  projects_new_rv:async(req,res)=>{
    RV.findOne({rv_number:req.body.rv_number},(err,data)=>{
      if(err){
        throw err;
      }
      if(data){
        res.send({message:"true"});
      }else{
        res.send({message:"false"});
      }
    })
  }
}

//Overall List of projects (RFQ, QTN, PO, DO, JCR, Inv, RV )
//Overall RFQ status - Pending, Open, Completed
//Same for All Items
//Yearly statics OPEN/PENDING/COMPLETED based on 

module.exports = api_controller;