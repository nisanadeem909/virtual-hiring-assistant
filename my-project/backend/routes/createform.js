const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form} = require('../mongo');

router.post("/createform", async(req,res)=>{
    console.log(req.body);
    const job = req.body.job;
    const questions = req.body.questions;
    const formdeadline = req.body.formdeadline;

    const newForm = new Form({
        jobTitle: job.jobTitle,
        jobID: job._id,
        formDeadline: formdeadline,
        questions: questions
      });

    var msg;

    try {

        const existingForm = await Form.findOne({ jobID: job._id });

        if (existingForm) {
            msg = {"status": "error","error":"Form already created for this job!"};
        }
        else {

            await newForm.save();
            
            const formLink = 'http://localhost:3000/applicant/formcollection/'+newForm._id;
            await Job.findByIdAndUpdate(job._id, { P2FormLink: formLink });
        
            msg = { status: "success", "formLink": formLink };
        }
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error","error":error};

    } 

    res.json(msg);

    res.end();

})


module.exports = router;