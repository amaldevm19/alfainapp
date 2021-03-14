// middleware function to check for logged-in users


var multer  = require('multer')

var sessionChecker = (req, res, next) => {
    console.log("Session in session checker")
    console.log(req.session.user);
    console.log(req.cookies.user_sid);
    if (req.session.user && req.cookies.user_sid) {
        res.locals.session = req.session;
        next();
    } else {
      res.locals.session = req.session;
      res.redirect('/users/login');
    }    
};

var rfq_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/rfq')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+file.originalname);
    }
  })
var rfq_upload = multer({ storage: rfq_storage })

// File handler for Quotation
var qtn_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/qtn')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+file.originalname);
    }
  })
var qtn_upload = multer({ storage: qtn_storage });

// File Handler for PO
var po_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/po')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+file.originalname);
    }
  })
var po_upload = multer({ storage: po_storage });

// File Handler for DO
var do_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/do')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+file.originalname);
    }
  })
var do_upload = multer({ storage: do_storage });

// File Handler for JCR
var jcr_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/jcr')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() +"-"+file.originalname);
  }
})
var jcr_upload = multer({ storage: jcr_storage });

// File Handler for Invoice
var inv_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/inv')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() +"-"+file.originalname);
  }
})
var inv_upload = multer({ storage: inv_storage });

// File Handler for Payment
var rv_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/rv')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() +"-"+file.originalname);
  }
})
var rv_upload = multer({ storage: rv_storage });

//File handler for customer
var vat_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/vat')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() +"-"+file.originalname);
  }
})
var vat_upload = multer({ storage: vat_storage });



module.exports = {sessionChecker, rfq_upload, qtn_upload, po_upload, do_upload, jcr_upload, inv_upload, rv_upload, vat_upload}
