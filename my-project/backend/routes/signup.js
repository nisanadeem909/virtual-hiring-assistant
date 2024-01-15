const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Admin,Company,CompanyRequest} = require('../mongo');
const bcrypt = require('bcrypt');

const session = require('express-session');
router.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));


router.post('/signup', async (req, res) => {
    const { username, email, password, name, designation,companyID } = req.body;
  
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

      const company = await Company.findOne({ username: companyID });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const companyId = company._id;
      const companyName = company.companyname;

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = new Recruiter({
      username,
      email,
      password: hashedPassword,
      name,
      designation,
      companyID:companyId,
      companyname: companyName, 
    });
  
      
      await newUser.save();
      // req.session.username = username;
      //   req.session.save();
        
  
      
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;