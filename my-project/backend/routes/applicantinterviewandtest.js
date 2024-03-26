const express = require('express');
const router = express.Router();
const cors=require('cors');
const fs = require('fs');
const formidable = require('formidable');
const {Job, Recruiter,JobApplication,Form,FormResponses,Notification,VideosResponses,Videos, TechTests,TestResponses} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));
const generatePassword = require('generate-password');

router.use(express.static('public'));
router.use(express.static('files'));

router.use("/static",express.static(path.join(__dirname,'public')));

router.use(express.static('public'));
router.use('/applicantvideos', express.static('applicantvideos'));
router.use('/applicantvideos', express.static(path.join(__dirname, 'applicantvideos')));



const mongoose = require('mongoose');


router.post('/checkapplicantcredentials', async (req, res) => {

    console.log("I am in check applicant credentials response")
    console.log(req.body)
  
    try {
      
      const thisJob = await Job.findOne({ _id: req.body.jobID });
      //Check Job is in Phase 3
      if (thisJob == null)
      {
        console.log("job not found")
        return res.json({status:"false",message:"An error occured"}) //Job not found
      }
      if (thisJob.status != 3)
      {
        console.log("job not in phase 3")
        return res.json({status:"false",message:"An error occured."}) //Job not in phase 3
      }
      
      //Check Applicant is in Phase 3 of THAT JOB only!
      const thisApp = await JobApplication.findOne({email:req.body.email, jobID: req.body.jobID})
      console.log(thisApp)
      
      if (thisApp == null)
      {
        console.log("applicant not found")
        return res.json({status:"false",message:"Applicant not found"})
      }
      if (thisApp.status != 3)
      {
        console.log("appl not in phase 3")
        return res.json({status:"false",message:"Applicant not found"}) //Applicant not in Phase 3
      }

      //Check if Applicant has already taken the test //AFTER TESTING UNCOMMENT THIS
      // const thisVidRes = await VideosResponses.findOne({applicantEmail:req.body.email})
      // if (thisVidRes)
      //   return res.json({status:"false",message:"You can only take this test once."})

      //Check Applicant password is the same
      if (thisApp.password != req.body.password)
      {
        console.log("password incorrect")
        return res.json({status:"false",message:"Incorrect credentials."})
      }
      
      res.json({status:"true",message:"Successful login"})
     
    } catch (error) {
      console.error('Error retrieving form responses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  });


router.post('/getvideointerviewdetails', async (req, res) => {

    console.log("I am in get video interview details")
    console.log(req.body)
  
    try {
      
      const vid = await Videos.findOne({ jobID: req.body.jobID });
      var testLen = null;
      var vidLen = null;

      if (vid)
      {
        vidLen = vid.duration;
        
      }
     
      const thisTest = await TechTests.findOne({jobID:req.body.jobID});

      if (thisTest)
      {
        testLen = thisTest.duration;
      }

      res.json({videoSubmissionTime : vid.duration,testSubmissionTime:testLen,startDate:thisTest.startDate,days:thisTest.days})
    } catch (error) {
      console.error('Error retrieving form responses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  });


  router.post('/getvideointerviewquestions', async (req, res) => {

    console.log("I am in get video interview questions")
    console.log(req.body)
  
    try {
      
      const video = await Videos.findOne({ jobID: req.body.jobID });
     
      if (!video) {
        return res.status(404).json({ message: 'Video not found for the given jobID' });
      }

      console.log(video.questions)
      const qs = video.questions;
      const duration = video.duration;
   
    res.json({questions: qs,duration:duration });

      
    } catch (error) {
      console.error('Error retrieving vid interview questions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  });


  router.post('/uploadapplicantvideo',async(req,res)=>{
   
    
    console.log("I am in uplaod applicant video")
    console.log(req.body)
    try{
    
     var form = new formidable.IncomingForm();
     var newpath;

     form.parse(req,async function(err,fields,files){
      console.log(fields)   
        console.log(files.Image)
         
        //Case 1: Video File has been attached.
        if (files.Image){
            var oldpath = String(files.Image.filepath); //this was files.Image.filepath
            
            const img_file = files.Image.originalFilename;
            console.log("original file name = " + img_file);
      
          
            newpath = String(__dirname + '/applicantvideos/' + files.Image.originalFilename);
            
            console.log("old path = " + oldpath);
            console.log("new path = " + newpath);
          
      
            try {
              fs.copyFileSync(oldpath,newpath);
            }
            catch (err) {
                console.log(err);
            }
            
           
            const vidApp = new VideosResponses({
              applicantEmail: fields.Email,
              jobID: fields.JobID,
              overallScore: 0,
              videoPath:files.Image.originalFilename,
              status: "uploaded"
            });
          
              
              await vidApp.save();
          }
          else //Case 2: No Video File uploaded
          {
            console.log("MISSING")    
            const vidApp = new VideosResponses({
                  applicantEmail: fields.Email,
                  jobID: fields.JobID,
                  overallScore: 0,
                  videoPath:" ",
                  status: "missing"
                });
              
                  
                  await vidApp.save();
          }
         
        
         
     });
     

    }
    catch(ex)
    {
        console.log("unexpected error" + ex)
    }
      
  })


  router.post('/submitquestionanswer', async (req, res) => {
    console.log("I am in submit question answer");
    console.log(req.body);
  
    try {
      const thisApp = await TestResponses.findOne({ applicantEmail: req.body.applicantEmail });
      if (!thisApp) 
      {
        console.log("does not exist");
        const newTestResp = new TestResponses({
          applicantEmail: req.body.applicantEmail,
          jobID: req.body.jobID,
          overallScore: 0,
          answers: Object.keys(req.body.answers).map(questionIndex => ({
            questionIndex: parseInt(questionIndex),
            answer: req.body.answers[questionIndex],
            
          }))
        });
  
        await newTestResp.save();
      } 
      else {
        console.log("already exists");
        const updatedAnswers = Object.keys(req.body.answers).map(questionIndex => ({
          questionIndex: parseInt(questionIndex),
          answer: req.body.answers[questionIndex],
          
        }));
  
        const found = await TestResponses.findOneAndUpdate(
          { applicantEmail: req.body.applicantEmail, jobID: req.body.jobID },
          {
            $set: {
              answers: updatedAnswers
            }
          },
          { new: true } // To return the updated document
        );
  
        console.log(found);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.post('/evaluatetest', async (req, res) => {
    console.log("I am in evaluate test");
    console.log(req.body);
  
    try {
      // Find the test response
      const testResp = await TestResponses.findOne({ jobID: req.body.jobID, applicantEmail: req.body.applicantEmail });
      
      if (!testResp) {
        console.error('Test response not found.');


        // In this case NONE of the applicant answers were submitted. 
        //  Create a test response and mark it 0
        const newTestResp = new TestResponses({
          applicantEmail: req.body.applicantEmail,
          jobID: req.body.jobID,
          overallScore: 0,
        });
      
          
          await newTestResp.save();
        
        return res.status(404).json({ error: 'Test response not found.' });
      }
  
      // Find the corresponding tech test object
      const testObj = await TechTests.findOne({ jobID: req.body.jobID });
  
      if (!testObj) {
        console.error('Tech test object not found.');
        return res.status(404).json({ error: 'Tech test object not found.' });
      }
  
      var totalScore= 0;
      testResp.answers.forEach(answer => {
        const questionIndex = answer.questionIndex;
      
        // Get the correct answer and score for the current question
        const correctAnswer = testObj.questions[questionIndex].answer;
        const questionScore = testObj.questions[questionIndex].points;
      
        // Compare the user's answer with the correct answer
        if (correctAnswer === answer.answer) {
          // If the answer is correct, update the status to true
          answer.status = true;
          // Add the question's score to the total score
          totalScore += questionScore;
        } else {
          // If the answer is incorrect, update the status to false
          answer.status = false;
        }
      });
      
      // Update the overall score in the testResp object
      testResp.overallScore = totalScore;
  
      // Save the updated test response
      await testResp.save();
      console.log("saved successfully")
      // Send success response
      res.status(200).json({ message: 'Test response evaluated successfully.', testResponse: testResp });
    } catch (error) {
      console.error('Error evaluating test response:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;