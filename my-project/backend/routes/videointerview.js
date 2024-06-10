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

router.post('/fetchacceptabilitytraits', async (req, res) => {
  console.log("Fetching acceptability traits for job ID:", req.body.jobId);

  try {
    const jobIDToFind = req.body.jobId;

    
    const videoData = await Videos.findOne({ jobID: jobIDToFind }).select('acceptabilityTraits').exec();
    
    if (videoData) {
      console.log('Acceptability Traits:', videoData.acceptabilityTraits);
      res.json({ acceptabilityTraits: videoData.acceptabilityTraits });
    } else {
      res.status(404).json({ error: 'No video data found for the given job ID' });
    }
  } catch (error) {
    console.error('Error retrieving acceptability traits:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
    
    const techTest = await TechTests.findOne({ jobID: jobIDToFind }).exec();
    // Sum the points of all questions in the test
    const totalPoints = techTest.questions.reduce((sum, question) => sum + (question.points || 0), 0);

    console.log("totalps: " + totalPoints);
    
    res.json({ responses: formResponses, total:totalPoints});
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
    let totalAnswered = 0; // Track total answered questions
    let totalQ = 0;

    testResponse.answers.forEach(answer => {
      if (answer.status === true) {
        totalCorrect++;
      } else {
        totalIncorrect++;
      }
      totalAnswered++; // Increment total answered for each answer processed
    });

    // Fetch the technical test associated with the jobIDToFind
    const techTest = await TechTests.findOne({ jobID: jobIDToFind }).exec();

    // Initialize categories object with zeros and store total number of questions in each category
const categories = {};
techTest.questions.forEach(question => {
  const category = question.category;
  categories[category] = { totalCorrect: 0, totalAnswered: 0, totalQuestions: 0 };
});

// Calculate total number of questions in each category
techTest.questions.forEach(question => {
  const category = question.category;
  categories[category].totalQuestions++;
});

    totalQ = techTest.questions.length;

    // Calculate total correct and total answered in each category
    testResponse.answers.forEach(answer => {
      const question = techTest.questions[answer.questionIndex];
      const category = question.category;
      categories[category].totalAnswered++;
      if (answer.status === true) {
        categories[category].totalCorrect++;
      }
    });

    const categoryPercentages = {}; // Object to store percentage of correct questions in each category

    // Calculate percentage of correct questions in each category
    Object.keys(categories).forEach(category => {
      const { totalCorrect, totalAnswered, totalQuestions } = categories[category];
      const correctPercentage = (totalCorrect / totalQuestions) * 100;
      categoryPercentages[category] = correctPercentage.toFixed(2); // Round to two decimal places
    });

    // Calculate total unanswered questions
    const totalUnanswered = totalQ - totalAnswered;

    res.json({
      timeTaken: testResponse.timeTaken,
      overallScore: testResponse.overallScore,
      totalCorrect: totalCorrect,
      totalIncorrect: totalIncorrect,
      
      totalLeft: totalUnanswered, // Include total unanswered in the response,
    
      total: totalCorrect+totalIncorrect+totalUnanswered,
      categoryPercentages: categoryPercentages
    });


  } catch (error) {
    console.error('Error retrieving test responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;