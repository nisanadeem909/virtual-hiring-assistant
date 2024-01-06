const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');

router.get('/alljobs', async (req, res) => {
    try {
     
      const jobs = await Job.find();
  
      
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/api/jobs/search', async (req, res) => {
    const query = req.query.q;
  
    try {
      const jobs = await searchJobs(query);
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Function to search for jobs in MongoDB
  const searchJobs = async (query) => {
    const regex = new RegExp(query, 'i'); // Case-insensitive search
  
    const jobs = await Job.find({ jobTitle: { $regex: regex } }).exec();
    return jobs;
  };
  

module.exports = router;