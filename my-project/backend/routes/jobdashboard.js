const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');

router.post("/getjob", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const job = await Job.findById(id);

        if (!job)
            msg = {"status": "not found"}
        else 
            msg = {"status": "success","job":job}
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error"};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/editjobcvscore", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const updatedJob = await Job.findOneAndUpdate(
            { _id: id },
            { $set: { AccCVScore: req.body.newScore } },
            { new: true } 
          );

        if (!updatedJob)
            msg = {"status": "error",'error':'not found'}
        else 
            msg = {"status": "success","job":updatedJob}
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

module.exports = router;