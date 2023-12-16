const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Notification} = require('../mongo');

router.post("/getnotifications", async(req,res)=>{

    var msg;

    try {

        

        const allNotifications = await Notification.find({});
        
        msg = { status: "success", "data": allNotifications };
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error","error":error};

    } 

    res.json(msg);

    res.end();

})


module.exports = router;