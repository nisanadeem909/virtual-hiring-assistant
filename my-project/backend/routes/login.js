const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Admin,Company} = require('../mongo');
const bcrypt = require('bcrypt');

const session = require('express-session');
router.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));

router.post('/loginrecruiter', async (req, res) => {
  const { username, password } = req.body;

  try {
    const recruiter = await Recruiter.findOne({ username });

    if (!recruiter) {
      return res.status(401).json({ message: 'Login failed' });
    }

    const passwordMatch = await bcrypt.compare(password, recruiter.password);

    if (passwordMatch) {
      req.session.username = username;
      req.session.save();

      res.json({ sessionId: req.session.username });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/recruiter/:sessionID', async (req, res) => {
  const sessionID = req.params.sessionID;

  try {
    
    const recruiter = await Recruiter.findOne({ username: sessionID });

    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }

    
    res.status(200).json(recruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/admin/:sessionID', async (req, res) => {
  const sessionID = req.params.sessionID;

  try {
    
    const admin = await Admin.findOne({ username: sessionID });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    
    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/company/:sessionID', async (req, res) => {
  const sessionID = req.params.sessionID;

  try {
    
    const company= await Company.findOne({ username: sessionID });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    
    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  router.post('/logincompany', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const company = await Company.findOne({ username });
  
      if (!company) {
        return res.status(401).json({ message: 'Company login failed' });
      }
  
      const passwordMatch = await bcrypt.compare(password, company.password);
  
      if (passwordMatch) {
        req.session.username = username;
        req.session.save();
  
        res.json({ sessionId: req.session.username });
      } else {
        res.status(401).json({ message: 'Company login failed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/loginadmin', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ username });
  
      if (!admin) {
        return res.status(401).json({ message: 'Admin login failed' });
      }
  
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (passwordMatch) {
        req.session.username = username;
        req.session.save();
  
        res.json({ sessionId: req.session.username });
      } else {
        res.status(401).json({ message: 'Admin login failed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;