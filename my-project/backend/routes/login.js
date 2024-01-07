const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');
const bcrypt = require('bcrypt');

const session = require('express-session');
router.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));

router.post('/login', async (req, res) => {
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

module.exports = router;