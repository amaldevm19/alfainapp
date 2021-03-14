const home_controller = {
    home:(req,res)=>{
        res.locals.session = req.session;
        res.render('home',{heading:"DASH BOARD"});
    }
}

//Overall List of projects (RFQ, QTN, PO, DO, JCR, Inv, RV )
//Overall RFQ status - Pending, Open, Completed
//Same for All Items
//Yearly statics OPEN/PENDING/COMPLETED based on 

module.exports = home_controller;