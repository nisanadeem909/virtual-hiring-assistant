const express = require('express');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const cors=require('cors');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));
router.use(express.static('public'));

router.use('/resumes', express.static('resumes'));
router.use('/resumes', express.static(path.join(__dirname, 'resumes')));

const {Job, Recruiter,JobApplication,Form,Notification} = require('../mongo');

router.post("/getjobapplications", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const jobApplications = await JobApplication.find({ jobID: id })
            .sort({ createdAt: -1 });

        if (!jobApplications)
            msg = {"status": "error",'error':'not found'}
        else 
            msg = {"status": "success","jobApps":jobApplications}
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error","error":error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/confirmcvshortlisting", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;
    const recruiterUsername = req.body.username;

    var msg;

    try {

        const foundJob = await Job.findOne({ _id: id });
        console.log(foundJob)

        foundJob.status = 2;
        foundJob.noShortlisted = false;
        foundJob.waitingCVShortlisted = false;

        console.log(foundJob)

        const updatedJob = await foundJob.save();

        console.log(updatedJob);

        const result = await JobApplication.bulkWrite([
                {
                  updateMany: {
                    filter: {
                      jobID: id,
                      CVMatchScore: { $gte: foundJob.AccCVScore }
                    },
                    update: {
                      $set: { status: 2 }
                    }
                  }
                },
                {
                  updateMany: {
                    filter: {
                      jobID: id,
                      CVMatchScore: { $lt: foundJob.AccCVScore }
                    },
                    update: {
                      $set: { status: 0 }
                    }
                  }
                }
              ]);
            

            console.log("Updated job applications: "+result);

            const newNotification = new Notification({
                companyname: foundJob.companyname,
                companyID: foundJob.companyID,
                jobTitle: foundJob.jobTitle,
                notifText: "CV Shortlisting has been confirmed by @"+recruiterUsername,
                recruiterUsername: foundJob.postedby,
                notifType: 1, 
                jobID: id,
              });
          
              const notification = await newNotification.save();
              msg = {"status": "success",'job':updatedJob};
        
    }
        catch (error) {
            console.error('Error :', error);
            msg = {"status": "error","error":error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

module.exports = router;