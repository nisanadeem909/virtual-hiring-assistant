const express = require('express');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const cors=require('cors');
const {Job, Recruiter,JobApplication,Form} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));
router.use(express.static('../profilepictures'));
router.use(express.static('public'));

router.use('/resumes', express.static('resumes'));


const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
router.post('/getjobdetailsforcvcollection', async (req, res) => {

    console.log("I am in get job details for cv collection")
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
          const jobDeadline = new Date(job.CVDeadline);

          // if (jobDeadline < currentDate) {
          //   res.status(400).json({ error: 'Job Expired' });
          //   console.log(currentDate) 
          //   console.log(jobDeadline)
          //   console.log("Job expired")
          //   return;
          // }
          
          
          res.json({ job });

          
        } else {
            res.status(404).json({ error: 'Job not found' });
            console.log("Job not found");
        }
    } catch (error) { 
        console.log("Error finding jobs:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
  
});

router.post('/submitcvapplication', async (req, res) => {

    
    console.log(req.body);

    try {
      const newJobApplication = {
        name: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        CVPath: 'not defined',
        CVMatchScore: 0,
        jobID: req.body.jobID,
        status: 1
      };
      const existingApplication = await JobApplication.findOne({
        email: req.body.email,
        jobID: req.body.jobID
      }).exec();
  
      if (existingApplication) {
        return res.status(400).json({ error: 'You have already applied for this position.' });
      }
      const jobApplication = await JobApplication.create(newJobApplication);
  
      console.log('Job application added successfully:', jobApplication);
  
      // Respond with success if needed
      res.json({ success: true });
    } catch (error) {
      console.log("Error submitting CV Application:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
});

router.post('/uploadcv', async (req, res) => {

console.log("I am in upload CV")    
var form = new formidable.IncomingForm();
   var newpath;
   form.parse(req,async function(err,fields,files){
       
       var oldpath = String(files.Resume.filepath); //this was files.Image.filepath
       //console.log(oldpath);
       const img_file = files.Resume.originalFilename;
       console.log("original file name = " + img_file);

       /*var oldpath = path.resolve(img_file);*/
       newpath = String(__dirname + '/resumes/' + files.Resume.originalFilename);
       
       console.log("old path = " + oldpath);
       console.log("new path = " + newpath);
       
       /*fs.copyFile(oldpath,newpath,function(err){
           console.log("I AM HERE");
           if(err) throw err;
           console.log("File uploaded and moved");
       });*/

       try {
        fs.copyFileSync(oldpath,newpath);
       }
       catch (err) {
          console.log(err);
       }
       
       //console.log(fields.UserType + " " + fields.Username);
       var appID = fields.email;

       try {
          console.log("File name "+img_file)
          console.log("FIELDS: "+fields)

            const result = await JobApplication.findOneAndUpdate(
              { email: fields.email.toString(),jobID:fields.jobID },
              { $set: { CVPath: img_file } },
              { new: true, overwrite: false }
            );
            if (!result)
              console.log("NOT FOUND")
            else
              console.log(result);
          } catch (error) {
            console.error('Error uploading resume:', error);
            // Handle the error
          }
   });
   //res.write("Hello");
   
   //res.json({Status:"Received"});

  // res.json({data:{NewPath: newpath}});
   res.end();
      

    
  
});
module.exports = router;