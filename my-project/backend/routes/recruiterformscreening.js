const express = require('express');
const router = express.Router();
const cors=require('cors');
const {Job, Recruiter,JobApplication,Form,FormResponses,Notification} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));

router.use(express.static('public'));




const mongoose = require('mongoose');

router.post('/fetchformresponses', async (req, res) => {

  console.log("I am in fetch form response")
  console.log(req.body)

  try {
    const jobIDToFind = req.body.jobId;

    const formResponses = await FormResponses.find({ jobID: jobIDToFind }).exec();
    
    console.log('Form Responses with job ID', jobIDToFind, ':', formResponses);
    
    res.json({ formResponses });
  } catch (error) {
    console.error('Error retrieving form responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});
router.post('/shortlistformresponses', async (req, res) => {

  console.log("I am in shortlist form response");
  console.log(req.body);

  try {
    const jobIDToFind = req.body.jobId;

    // Fetch form responses for the given jobID
    const formResponses = await FormResponses.find({ jobID: jobIDToFind }).exec();

    
    
    const form = await Form.findOne({ jobID: jobIDToFind }).exec();

    if (!form) {
      console.error('Form not found for the given jobID:', jobIDToFind);
      return res.status(404).json({ error: 'Form not found' });
    }

    //----------------KOMAL ADDED---------------------

    console.log(formResponses)
    if(!formResponses || formResponses.length == 0) // no applications
    {
          //console.log("IM HEREEEEEEEEEEEEE")
          const updatedJob = await Job.findOneAndUpdate(
              { _id: jobIDToFind },
              { $set: { noShortlisted: true } },
              { new: true } // To return the updated document
          );
          console.log(updatedJob)
      
          const notificationData = new Notification({
              jobTitle: updatedJob.jobTitle,
              jobID: jobIDToFind,
              notifText: 'Phase 2 deadline has passed but no applications! Please extend deadline to continue..',
              recruiterUsername: updatedJob.postedby,
              notifType: 2
          });
      
          await notificationData.save();
          res.status(500).json({ error: "No form responses!" });
    }
    else{//--------------

    // Extract correct answer statements dynamically
    const correctAnswers = form.questions.map((question) => {
      return question.options[question.answer];
    });

    console.log("Correct Answers:");
    console.log(correctAnswers);

    

  
    // Filter form responses with correct answers
    const shortlistedResponses = formResponses.filter((response) => {
      console.log(response.applicantEmail);
      
      const allAnswersMatch = response.answers.every((answer, index) => {
        console.log(answer.question);
        console.log("Actual Answer:", answer.answerStatement);
        console.log("Correct Answer:", correctAnswers[index]);
        console.log("Comparison Result:", answer.answerStatement == correctAnswers[index]);
        return answer.answerStatement == correctAnswers[index];
      });
    
      console.log("All Answers Match:", allAnswersMatch);
    
      return allAnswersMatch;
    });
      console.log("SHORTLISTED======")
      console.log(shortlistedResponses)

      //----------------KOMAL ADDED---------------------
      var flag = true;
      if (shortlistedResponses.length == 0){
        
        console.log("NO ONE SHORTLISTED")
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobIDToFind },
            { $set: { noShortlisted: true } },
            { new: true } 
        );
        console.log(updatedJob)
    
        const notificationData = new Notification({
            jobTitle: updatedJob.jobTitle,
            jobID: jobIDToFind,
            notifText: 'Phase 2 deadline has passed but no application could be shortlisted!',
            recruiterUsername: updatedJob.postedby,
            notifType: 2
        });
    
        await notificationData.save();
        flag = false;

      }
      //else{ //------------

      await FormResponses.updateMany(
        { _id: { $in: shortlistedResponses.map(response => response._id) } },
        { $set: { status: "Shortlisted" } }
      );
  
      // Update the status of remaining responses to "Rejected"
      await FormResponses.updateMany(
        { _id: { $nin: shortlistedResponses.map(response => response._id) },jobID: jobIDToFind },
        { $set: { status: "Rejected" } }
      );
    


      //We will also update job-applicants status to 3 who have passed to the next phase
      const shortlistedEmails = shortlistedResponses.map(response => response.applicantEmail);
      console.log(shortlistedEmails)
      await JobApplication.updateMany(
          {
              email: { $in: shortlistedEmails },
              jobID: jobIDToFind
          },
          {
              $set: {
                  status: 3
              }
          }
      );

      // Set status to -2 for emails not in the shortlistedEmails array
      await JobApplication.updateMany(
          {
              email: { $nin: shortlistedEmails },
              jobID: jobIDToFind,
              status: 2
          },
          {
              $set: {
                  status: -2
              }
          }
      );
      console.log("UPDATED JOB APPS")

    const updatedFormResponses = await FormResponses.find({ jobID: jobIDToFind }).exec();
    if (flag)
      res.status(200).json({ updatedFormResponses });
    else
      res.status(500).json({ error: "No form responses shortlisted!" });
    }//}
  } 
  catch (error) {
    console.error('Error retrieving and shortlisting form responses:', error);
    res.status(500).json({ error: error });
  }

});
module.exports = router;