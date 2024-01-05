const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');

router.post("/getjobapplications", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const jobApplications = await JobApplication.find({ jobID: id});

        if (!jobApplications)
            msg = {"status": "not found"}
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