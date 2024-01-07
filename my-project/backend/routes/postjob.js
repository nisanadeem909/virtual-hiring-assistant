const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');

router.post('/api/saveFormData', async (req, res) => {
    try {
      const formData = req.body;
      const sessionID = formData.sessionID; 
  
      // Save all data at once
      const job = new Job({
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        postedby: sessionID,
        CVDeadline: formData.phase1Deadline,
        AccCVScore: formData.phase1Percentage,
       
      });
  
      const savedJob = await job.save();
      res.json(savedJob);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/api/updateEmailsAndForm/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { rejectEmailBody } = req.body;
  
     
      const job = await Job.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            rejectEmailBody,
          },
        },
        { new: true }
      );
  
      res.json(job);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/api/emailForm/:jobID', async (req, res) => {
    try {
      const { jobID } = req.params;
      const { formEmailSub, formEmailBody } = req.body;
  
     
      const job = await Job.findOneAndUpdate(
        { _id: jobID },
        {
          $set: {
            formEmailSub,
            formEmailBody,
          },
        },
        { new: true }
      );
  
      res.json(job);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;