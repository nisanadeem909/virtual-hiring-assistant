const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Notification} = require('../mongo');

router.post("/getnotifications", async(req,res)=>{

    console.log(req.body);
    const username = req.body.recruiter;

    var msg;

    try {
        const recruiter = await Recruiter.findOne({ username: username });

        if (!recruiter) {
            msg = { status: "error", error: 'Recruiter not found' };
        } else {
            const companyID = recruiter.companyID;

            const allNotifications = await Notification.find({ companyID }).sort({ createdAt: -1 }).exec();
            msg = { status: "success", data: allNotifications };
        }
    } catch (error) {
        console.error('Error getting notifications:', error);
        msg = { status: "error", error: error };
    } finally {
        res.json(msg);
        res.end();
    }
});


module.exports = router;