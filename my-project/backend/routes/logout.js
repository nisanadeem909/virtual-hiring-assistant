const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Company,Admin} = require('../mongo');
const bcrypt = require('bcrypt');

const session = require('express-session');
router.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ message: 'Server error' });
      } else {
        console.log('Logout Successful!');
        
      }
    });
    res.end();
  });

  router.post("/changepassword", async(req,res)=>{

    console.log(req.body);

    const username = req.body.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const userType = req.body.type;

    var msg;

    if (userType === 'recruiter'){

    try {

        

        const user = await Recruiter.findOne({ username });

        if (!user) 
          msg = {"status": "error","error":"User not found!"};
        else
        {
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);

            if (!passwordMatch) 
              msg = {"status": "error","error":"Incorrect old password!"};
            else 
            {
              const hashedNewPassword = await bcrypt.hash(newPassword, 12);
              user.password = hashedNewPassword;
              await user.save();

              msg = {"status": "success"};
            }
        }
    }
        catch (error) {
            console.error('Error removing:', error);
            msg = {"status": "error","error":error};

    } }
    else if (userType==='admin'){
      try {
          const admin = await Admin.findOne({ username });

          if (!admin) 
              msg = { "status": "error", "error": "Admin not found!" };
          else {
              const passwordMatch = await bcrypt.compare(oldPassword, admin.password);

              if (!passwordMatch) 
                  msg = { "status": "error", "error": "Incorrect old password!" };
              else {
                  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
                  admin.password = hashedNewPassword;
                  await admin.save();

                  msg = { "status": "success" };
              }
          }
      } catch (error) {
          console.error('Error changing admin password:', error);
          msg = { "status": "error", "error": error };
      }
    }
    else if (userType == 'company'){
      try {
          const company = await Company.findOne({ username });

          if (!company) 
              msg = { "status": "error", "error": "Company not found!" };
          else {
              const passwordMatch = await bcrypt.compare(oldPassword, company.password);

              if (!passwordMatch) 
                  msg = { "status": "error", "error": "Incorrect old password!" };
              else {
                  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
                  company.password = hashedNewPassword;
                  await company.save();

                  msg = { "status": "success" };
              }
          }
      } catch (error) {
          console.error('Error changing company password:', error);
          msg = { "status": "error", "error": error };
      }
    }

    res.json(msg);

    res.end();

})


  module.exports = router;