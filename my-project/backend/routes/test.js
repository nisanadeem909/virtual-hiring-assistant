const express = require('express');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const cors=require('cors');
const {Job, Recruiter,JobApplication,Form, Company, TechTests} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));

router.use(express.static('public'));
router.use('/questionimages', express.static('questionimages'));
router.use('/questionimages', express.static(path.join(__dirname, 'questionimages')));




router.post("/createtest", async(req,res)=>{
    console.log(req.body);
    const job = req.body.job;
    const questions = req.body.questions;
    const duration = req.body.duration;

    const newTest = new TechTests({
        jobTitle: job.jobTitle,
        jobID: job._id,
        duration: duration,
        questions: questions
      });

    // check if video and add days,startdate,importance

    var msg;

    try {

        const existingForm = await TechTests.findOne({ jobID: job._id });

        if (existingForm) {
            msg = {"status": "error","error":"Test already created for this job!"};
        }
        else {

            await newTest.save();
                        
            msg = { status: "success"};
        }
    }
        catch (error) {
            console.error('Error adding test:', error);
            msg = {"status": "error","error":error};

    } 

    res.json(msg);

    res.end();

})


router.post('/uploadquestionpic', function(req,res){
    // var name = req.body.name;
    console.log(req.body)
    var msg;
    try{
    
     var form = new formidable.IncomingForm();
     var newpath;
     form.parse(req,async function(err,fields,files){
         console.log(files.Image)
         var oldpath = String(files.Image.filepath); //this was files.Image.filepath
         //console.log(oldpath);
         const img_file = files.Image.originalFilename;
            console.log("original file name = " + img_file);
            const timestamp = Date.now();
            const newFileName = `${timestamp}_${img_file}`;

            newpath = path.join(__dirname, '/questionimages/', newFileName);
         
         console.log("old path = " + oldpath);
         console.log("new path = " + newpath);
         
         /*fs.copyFile(oldpath,newpath,function(err){
             console.log("I AM HERE");
             if(err) throw err;
             console.log("File uploaded and moved");
         });*/
  
          fs.copyFileSync(oldpath,newpath);
         
         //console.log(fields.UserType + " " + fields.Username);
           
   
         msg = {status: 'success', NewPath: newFileName}
         res.json({msg});
         res.end();
        });
        

    }
    catch(ex)
    {
        msg = {status:'error',error:ex}
        res.json({msg});
        res.end();
    }
      
  });   

  router.post("/getjobtest", async(req,res)=>{
    console.log(req.body);

    const id = req.body.job;

    var msg;

    try {

        const form = await TechTests.findOne({ jobID: id });

        console.log(form)

        if (!form)
            msg = {"status": "error",error:"not found"}
        else 
            msg = {"status": "success","form":form}
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error"};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})


router.post("/edittest", async(req,res)=>{
    console.log(req.body);
    const id = req.body._id;
    const questions = req.body.questions;
    const duration = req.body.duration;

    const updatedData = {
        duration: duration,
        questions: questions
      };

    var msg;

    try {

        const updatedForm = await TechTests.findOneAndUpdate(
            { _id: id },
            { $set: updatedData },
            { new: true } // To return the updated document
          );

        if (!updatedForm) {
            msg = {"status": "error","error":"Test not found!"};
        }
        else {
            msg = { status: "success"};
        }
    }
        catch (error) {
            console.error('Error editing test:', error);
            msg = {"status": "error","error":error};

    } 

    res.json(msg);

    res.end();

})


  module.exports = router;