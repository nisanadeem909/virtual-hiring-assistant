const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Notification} = require('../mongo');

router.post("/getrecruiters", async(req,res)=>{

    var msg;

    try {

        

        const allRecruiters = await Recruiter.find({ username: { $ne: 'admin' } });

        if (allRecruiters)
            msg = { status: "success", "recs": allRecruiters };
        else
            msg = {"status": "error","error":"not found"};
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error","error":error};

    } 

    res.json(msg);

    res.end();

})


module.exports = router;