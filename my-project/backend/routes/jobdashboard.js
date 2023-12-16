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

module.exports = router;