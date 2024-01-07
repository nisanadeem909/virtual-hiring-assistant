const express = require('express');
const router = express.Router();
const cors=require('cors');
const {Job, Recruiter,JobApplication,Form,FormResponses} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));

router.use(express.static('public'));




const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


router.post('/getjobdetailsforformcollection', async (req, res) => {

    console.log("I am in get job details for form collection")
    console.log(req.body)
    
    // const newForm = new Form({
    //     jobTitle: 'React Native Developer',
    //     jobID: req.body.jobID, // Replace with an actual job ID
    //     formDeadline: new Date('2024-12-31'), // Replace with an actual deadline
      
    //     questions: [
    //       {
    //         _id:  new mongoose.Types.ObjectId() ,
    //         answer: 1,
    //         options: ['Yes, I am willing to relocate.', 'No, I am not.'],
    //         question: 'Can you relocate to Lahore for on-site work?',
    //       },
    //       {
    //         _id: new mongoose.Types.ObjectId(),
    //         answer: 2,
    //         options: ['I am a fresh graduate.', 'More than 2 years.'],
    //         question: 'What is your experience in React JS?',
    //       },
    //       {
    //         _id: new mongoose.Types.ObjectId(),
    //         answer: 1,
    //         options: ['Yes, I have graduated.', 'No, I have not graduated.'],
    //         question: 'Is your current degree completed?',
    //       },
    //       // Add more questions as needed
    //     ],
    //   });
      
      
    //   // Save the object to the database
    //   newForm.save()
    //     .then((form) => {
    //       console.log('Form saved:', form);
    //     })
    //     .catch((error) => {
    //       console.error('Error saving form:', error);
    //     });



    try {
        
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.body.jobID);

        if (!isValidObjectId) {
            res.status(400).json({ error: 'Invalid job ID' });
            return;
        }
        
        const job =  await Job.findById(req.body.jobID);
        
        //add check if job.CVDeadline is greater than today's date then return an error
        
        if (job) {
            
          const currentDate = new Date();
          const jobDeadline = new Date(job.CVDeadline);

          // if (jobDeadline < currentDate) {
          //   res.status(400).json({ error: 'Job Expired' });
          //   console.log(currentDate) 
          //   console.log(jobDeadline)
          //   console.log("Job expired")
          //   return;
          // }
          
          

          const form = await Form.findOne({ jobID: req.body.jobID });
          if (form)
          {
            console.log(form)
            res.json({ job,form });
          }
          else{
            console.log("No form exists against this job ID")
          }

          
        } else {
            res.status(404).json({ error: 'Job not found' });
            console.log("Job not found");
        }
    } catch (error) { 
        console.log("Error finding jobs:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
  
});
router.post('/submitformresponse', async (req, res) => {

  console.log("I am in submit form response")
  console.log(req.body)

  try {
        
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.body.jobID);

        if (!isValidObjectId) {
            res.status(400).json({ error: 'Invalid job ID' });
            return;
        }
        
        const job =  await Job.findById(req.body.jobID);
        
        //add check if job.CVDeadline is greater than today's date then return an error
        
        if (job) {
            
          const currentDate = new Date();
          const jobDeadline = new Date(job.P2FormDeadline);

          if (jobDeadline < currentDate) {
            res.status(400).json({ error: 'Job Form Deadline Expired' });
            console.log(currentDate) 
            console.log(jobDeadline)
            console.log("Job Form deadline expired")
            return;
          }
          
          try {
            // Check if an existing form response exists with the applicant's email
            const existingFormResponse = await FormResponses.findOne({
              applicantEmail: req.body.email,
              jobID: req.body.jobID,
            });

            if (existingFormResponse) {
              res.status(400).json({ error: 'Form Response Already Submitted' });
              console.log("Form Response already submitted for this email");
              return;
            }

            const newFormResponse = {
              applicantEmail: req.body.email,
              jobID: req.body.jobID,
              answers: req.body.answers
            };
            
            //Check if an applicant has submitted their CV or not!
            const existingApplication = await JobApplication.findOne({
              email: req.body.email,
              jobID: job._id  // Convert to ObjectId if needed
            });
            console.log(req.body.email)
            console.log(req.body.jobID)
            console.log(existingApplication)
            if (!existingApplication) {
              console.log("This applicant has not submitted their CV.")  
              res.status(700).json({ error: 'Something went wrong. Seems like you have not submitted your CV earlier.' });
              return;// res.status(400).json({ error: 'You have not submitted CV for this job, you cannot proceed to this Phase.' });
            }
        
            


            const jobApplication = await FormResponses.create(newFormResponse);
        
            console.log('Form Response added successfully:', jobApplication);
        
            // Respond with success if needed
            res.json({ success: true });
          } catch (error) {
            console.log("Error submitting Form Response:", error);
            res.status(500).json({ error: 'Internal Server Error' });
          }

          
        } else {
            res.status(404).json({ error: 'Job not found' });
            console.log("Job not found");
        }
    } catch (error) { 
        console.log("Error finding jobs:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;