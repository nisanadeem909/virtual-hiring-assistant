const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Videos} = require('../mongo');
const { ObjectId } = require('mongodb')
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    port: 465,
    host:"smtp.gmail.com",
    auth: {
    user: 'virtualhiringassistant04@gmail.com',
    pass: 'glke rmyu xnfa yozn'
    },
    secure: true,
    });

router.get('/alljobs/:recruiterUsername', async (req, res) => {
  const username = req.params.recruiterUsername;

  try {
    const recruiter = await Recruiter.findOne({ username: username });
    
    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }

    const companyID = recruiter.companyID;

    const jobs = await Job.find({ companyID }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/jobs/search', async (req, res) => {
  const query = req.query.q;
  const recruiterSessionID = req.query.sessionID; // Assuming sessionID holds the companyID
  
  try {
    const recruiter = await Recruiter.findOne({ username: recruiterSessionID });
     
    if (!recruiter) {
        return res.status(404).json({ error: 'Recruiter not found' });
    }

    const recruiterCompanyID = recruiter.companyID; // Assuming companyID is the field in the recruiter document
   
      const jobs = await searchJobs(query, recruiterCompanyID);
      console.log(jobs);
      res.json(jobs);
  } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Function to search for jobs in MongoDB
const searchJobs = async (query, recruiterCompanyID) => {
  const regex = new RegExp(query, 'i'); // Case-insensitive search

  const jobs = await Job.find({ jobTitle: { $regex: regex }, companyID: recruiterCompanyID }).exec();
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
  router.post('/filterjobsnabeeha', async (req, res) => {
    console.log("filter jobs nabeeha")
    console.log(req.body)
    
    try {
      const recruiterInfo = await Recruiter.findOne(
        { username: req.body.username }
      );
  
      if (recruiterInfo) {
        // If a recruiter is found with the provided username
        const { companyname, companyID } = recruiterInfo;
        const filters = req.body.selectedFilters; 
       
        for (let i = 0; i < filters.length; i++) {
          
          if (filters[i] === 'Phase 3 & 4') {
            
            filters.splice(i, 1, 'Phase 3', 'Phase 4');
          }
          if (filters[i] === 'Shortlisted') {
            
            filters.splice(i, 1, 'Phase 5');
          }
        }
        let statusFilters = [];

   
        // Iterate through filters and map phases to status values
        filters.forEach((phase) => {
            switch (phase) {
                case 'Phase 1':
                    statusFilters.push(1);
                    break;
                case 'Phase 2':
                    statusFilters.push(2);
                    break;
                case 'Phase 3':
                      statusFilters.push(3);
                      break;
                case 'Phase 4':
                        statusFilters.push(4);
                        break;
                case 'Phase 5':
                          statusFilters.push(5);
                          break;
                case 'On Hold':
                            statusFilters.push("On Hold");
                            break;
                default:
                    break;
            }
        });

        console.log("status filters: ")
        
      

        // Apply filters to the query based on the selected phases
        if (statusFilters.length > 0) {
           

            let filteredJobs;
            if (statusFilters.includes("On Hold"))
            {
              query = {
                
                companyID: recruiterInfo.companyID,
                postjob: false
                
              };
          
            const index = statusFilters.indexOf('On Hold');
            if (index !== -1) {
              statusFilters.splice(index, 1); // Remove 'On Hold'
            }
            filteredJobs =await Job.find(query).sort({ createdAt: -1 });
            
            new_query = {
              status: { $in: statusFilters },
              companyID: recruiterInfo.companyID,
              postjob: true
              
            };
            const additionalFilteredJobs = await Job.find(new_query).sort({ createdAt: -1 });
            
            filteredJobs = filteredJobs.concat(additionalFilteredJobs);
            
            console.log(filteredJobs)
            
          }
          
          
          
          else{
            new_query = {
              status: { $in: statusFilters },
              companyID: recruiterInfo.companyID,
              postjob: true
              
            };
            filteredJobs = await Job.find(new_query).sort({ createdAt: -1 });
            
          }
  
          res.status(200).json(filteredJobs);
        }
      else {
        const query = {
          
          companyID: recruiterInfo.companyID, // Add this condition to filter by company name
        }; 

        console.log( query)
        const filteredJobs = await Job.find(query).sort({ createdAt: -1 });


        console.log("filtered jobs now: ")
       // console.log(filteredJobs);

        res.status(200).json(filteredJobs);
        }
        // Query the Jobs table with the constructed query
       
    } 
         
    } catch (error) {
      // Handle any errors that may occur during the query
      console.error('Error fetching company info:', error);
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

router.post('/api/save-video', async (req, res) => {
  try {
    // Extract video data from the request body
    const { jobTitle, jobID, questions, duration, acceptabilityTraits, importance } = req.body;

    // Create a new video instance
    const newVideo = new Videos({
      jobTitle,
      jobID,
      questions,
      duration,
      acceptabilityTraits,
      importance,
    });

    // Save the video to the database
    await newVideo.save();

    // Send a success response
    res.status(200).json({ message: 'Video data saved successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error saving video data:', error);
    res.status(500).json({ error: 'Failed to save video data' });
  }
});

router.post('/send-email', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var subj = req.body.subject;
  var msg = req.body.msg;



  var mailOptions = {
    from: 'virtualhiringassistant04@gmail.com',
    to: email,
    subject: subj,
    text: `You have been added as a recruiter!\n\nUsername: ${username}\nPassword: ${password}\n`,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error)
      console.log(error);
    else
      console.log('Email sent: ' + info.response);
  });

  res.json({ success: true });
});

module.exports = router;