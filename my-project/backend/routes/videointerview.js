const express = require('express');
const router = express.Router();
const cors=require('cors');
const {Job, Recruiter,JobApplication,Form,FormResponses,Notification,VideosResponses,Videos, TechTests,TestResponses} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));
const generatePassword = require('generate-password');

router.use(express.static('public'));




const mongoose = require('mongoose');

router.post('/fetchvideoresponses', async (req, res) => {

  console.log("I am in fetch video response")
  console.log(req.body)

  try {
    const jobIDToFind = req.body.jobId;

    const formResponses = await VideosResponses.find({ jobID: jobIDToFind }).exec();
    
    console.log('Video Responses with job ID', jobIDToFind, ':', formResponses);
    
    res.json({ responses: formResponses });
  } catch (error) {
    console.error('Error retrieving form responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});
router.post('/checkifquestionnaireexists', async (req, res) => {

  console.log("I am in checkifquestionnaireexists")
  console.log(req.body)

  try {
    const jobIDToFind = req.body.jobId;

    const formResponses = await Videos.find({ jobID: jobIDToFind }).exec();
    
    
    if (formResponses){
      
      res.json({ status:"true"});
    }
    else
      res.json({"status":false});
    
  } catch (error) {
    console.error('Error retrieving form responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

router.post('/getvideointerviewstartdate', async (req, res) => {

  console.log("I am in getvideointerviewstartdate")
  //console.log(req.body)

  try {
    const jobIdToFind = req.body.jobId;
  
    // Find the document with the provided jobId
    const techTest = await  TechTests.findOne({ jobID: jobIdToFind }).exec();
    console.log("TECH TEST start data")
    console.log(techTest)
    if (techTest) {
      const { startDate } = techTest.startDate;
      const currentDate = new Date();
      
      // Compare startDate with currentDate
      const isStartDateBeforeCurrentDate = startDate < currentDate;
  
      res.json({ "startdate" : isStartDateBeforeCurrentDate });
    } else {
      res.status(404).json({ error: 'Tech test not found for the provided jobId' });
    }
  } catch (error) {
    console.error('Error retrieving tech test:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

router.post('/fetchtestresponsesnabeeha', async (req, res) => {

  console.log("I am in fetch test response")
  console.log(req.body)

  try {
    const jobIDToFind = req.body.jobId;

    const formResponses = await TestResponses.find({ jobID: jobIDToFind }).exec();
    
    console.log('Test Responses with job ID', jobIDToFind, ':', formResponses);
    
    res.json({ responses: formResponses });
  } catch (error) {
    console.error('Error retrieving test responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});
router.post('/fetchtestresponsestats', async (req, res) => {
  console.log("I am in fetch test response");
  console.log(req.body);

  try {
    const jobIDToFind = req.body.jobID;
    const appID = req.body.applicantEmail;

    const testResponse = await TestResponses.findOne({ jobID: jobIDToFind, applicantEmail: appID }).exec();

    console.log('Test Responses with job ID', jobIDToFind, ':', testResponse);

    let totalCorrect = 0;
    let totalIncorrect = 0;

    
      testResponse.answers.forEach(answer => {
        if (answer.status === true) {
          totalCorrect++;
        } else {
          totalIncorrect++;
        }
      });
    

    res.json({ 
      timeTaken: 10,
      overallScore: testResponse.overallScore,
      totalCorrect: totalCorrect,
      totalIncorrect: totalIncorrect,
      totalLeft: 0
    });
  } catch (error) {
    console.error('Error retrieving test responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;