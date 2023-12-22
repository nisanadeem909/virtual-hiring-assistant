const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');

const session = require('express-session');
router.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));


router.post('/signup', async (req, res) => {
    const { username, email, password, name, designation } = req.body;
  
    try {
      
      const existingUser = await Recruiter.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email is already in use.' });
      }

  
     
      const newUser = new Recruiter({
        username,
        email,
        password,
        name,
        designation,
      });
  
      
      await newUser.save();
      req.session.username = username;
        req.session.save();
        
  
      
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;