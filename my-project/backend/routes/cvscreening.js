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

const {Job, Recruiter,JobApplication,Form} = require('../mongo');

router.post("/getjobapplications", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const jobApplications = await JobApplication.find({ jobID: id});

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

module.exports = router;