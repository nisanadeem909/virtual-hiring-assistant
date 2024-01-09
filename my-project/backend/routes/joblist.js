const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');
const { ObjectId } = require('mongodb')

router.get('/alljobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

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

  router.get('/getRejectionEmailBody/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
    
  
      // Convert jobId to a valid ObjectId
      const objectIdJobId = new ObjectId(jobId);
  
      const job = await Job.findById(objectIdJobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      console.log(job);
      return res.status(200).json({ rejectionEmailBody: job.rejectEmailBody });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/findrejected', async (req, res) => {
    try {
      const rejectedApplications = await JobApplication.find({ status: 0 });
      res.json(rejectedApplications);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/findjob/:jobId', async (req, res) => {
    try {
      const jobId = req.params.jobId;
  
      // Use Mongoose to find the job by job ID
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      // If job is found, send it in the response
      res.status(200).json(job);
    } catch (error) {
      console.error('Error finding job:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/getApplicationsByStatus/:status', async (req, res) => {
    const { status } = req.params;
  
    try {
      const shortlistedApplications = await JobApplication.find({ status: parseInt(status, 10) });
      res.json(shortlistedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/getFormEmail/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);

        if (job) {
            const formEmailData = {
                formEmailBody: job.formEmailBody,
                formEmailSub: job.formEmailSub,
            };
            res.json(formEmailData);
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        console.error('Error fetching form email details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/update_formlinkstatus/:applicantId', async (req, res) => {
  try {
    const applicantId = req.params.applicantId;
    
    const updateResult = await JobApplication.updateOne(
      { _id: new ObjectId(applicantId) },
      { $set: { formlinkstatus: 1 } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: 'formlinkstatus updated successfully' });
    } else {
      res.status(404).json({ message: 'Applicant not found or formlinkstatus already updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/findrejectedform', async (req, res) => {
  try {
    const rejectedApplications = await JobApplication.find({ status: -2 });
    res.json(rejectedApplications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/updateRejectionStatus/:applicantId', async (req, res) => {
  try {
      const { applicantId } = req.params;

      console.log("UPDATING REJECTION STATUS "+applicantId)

      // Find the JobApplication by applicantId and update the rejectionStatus to 1
      const updatedApplicant = await JobApplication.findByIdAndUpdate(
          applicantId,
          { $set: { rejectionstatus: 1 } },
          { new: true }
      );

      if (!updatedApplicant) {
          console.log("Applicant not found")
          return res.status(404).json({ message: 'Applicant not found' });
      }

      return res.status(200).json({ message: 'Rejection status updated successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;