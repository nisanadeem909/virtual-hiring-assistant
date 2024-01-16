const express = require('express');
const router = express.Router();
const {Company,CompanyRequest,Admin,Recruiter} = require('../mongo');
const bcrypt = require('bcrypt');

const session = require('express-session');
router.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));


router.post('/companysignup', async (req, res) => {
    const { username, email, password, companyname } = req.body;  
  console.log(req.body)
    try {
      
        const existingCompany = await Company.findOne({ $or: [{ username }, { email }] });
    
        if (existingCompany) {
          console.log("existing company")
          return res.status(200).json({ error: 'Username or email is already in use.' });
        }
      
        const existingRecruiter = await Recruiter.findOne({ $or: [{ username }, { email }] });
    
        if (existingRecruiter) {
          console.log("existing recruiter")
          return res.status(200).json({ error: 'Username or email is already in use.' });
        }
      
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    
        if (existingAdmin) {
          console.log("existing admin")
          return res.status(200).json({ error: 'Username or email is already in use.' });
        }

      const existingCompanyReq = await CompanyRequest.findOne({ $or: [{ username }, { email }] });
  
      if (existingCompanyReq) {
        console.log("existing company request")
        return res.status(200).json({ error: 'Username or email is already requested.' });
      }

      console.log(req.body)

      console.log("creating company request")
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
     
      const newCompany = new CompanyRequest({
        username,
        email,
        password: hashedPassword,
        companyname: req.body.name,  
      });
  
      await newCompany.save();
  
      res.status(201).json({ company: newCompany }); 
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.post("/getcompanyrequests", async (req, res) => {
    var msg;

    try {
        const allCompanyRequests = await CompanyRequest.find().sort({ createdAt: -1 }).exec();

        msg = { status: "success", reqs: allCompanyRequests };
    } catch (error) {
        console.error('Error getting company requests:', error);
        msg = { status: "error", error: error };
    }

    res.json(msg);
    res.end();
});

router.post("/getcompanies", async (req, res) => {
  var msg;

  try {
      const allCompanies = await Company.find().sort({ createdAt: -1 }).exec();

      msg = { status: "success", data: allCompanies };
  } catch (error) {
      console.error('Error getting companies:', error);
      msg = { status: "error", error: error };
  }

  res.json(msg);
  res.end();
});

router.post("/approveCompanyRequest", async (req, res) => {
  console.log(req.body)
  const requestId = req.body._id;
  let msg;

  try {
    const companyRequest = await CompanyRequest.findById(requestId);
    console.log(companyRequest)
    if (!companyRequest) {
      msg = { status: "error", error: 'Company request not found.' };
    } else {
      await CompanyRequest.deleteOne({ _id: requestId });

      const newCompany = new Company({
        companyname: companyRequest.companyname,
        username: companyRequest.username,
        email: companyRequest.email,
        password: companyRequest.password,
        profilePic: companyRequest.profilePic,
      });

      await newCompany.save();

      msg = { status: "success", message: 'Company request removed and company added successfully.' };
    }
  } catch (error) {
    console.error('Error removing company request and adding company:', error);
    msg = { status: "error", error: error };
  }

  console.log(msg)

  res.json(msg);
});


router.post("/disapproveCompanyRequest", async (req, res) => {
  console.log(req.body)
  const requestId = req.body._id;
  let msg;

  try {
    const companyRequest = await CompanyRequest.findById(requestId);
    console.log(companyRequest)
    if (!companyRequest) {
      msg = { status: "error", error: 'Company request not found.' };
    } else {
      await CompanyRequest.deleteOne({ _id: requestId });

      msg = { status: "success", message: 'Company request removed successfully.' };
    }
  } catch (error) {
    console.error('Error removing company request:', error);
    msg = { status: "error", error: error };
  }

  console.log(msg)

  res.json(msg);
});



module.exports = router;