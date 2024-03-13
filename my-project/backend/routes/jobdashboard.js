const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Notification,TechTests,Videos} = require('../mongo');

const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${formattedDate.getDate()}`.padStart(2, '0');
    let hours = formattedDate.getHours();
    const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${amOrPm}`;
  };

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

router.post("/getjobform", async(req,res)=>{
    console.log(req.body);

    const id = req.body.job;

    var msg;

    try {

        const form = await Form.findOne({ jobID: id });

        console.log(form)

        if (!form)
            msg = {"status": "error",error:"not found"}
        else 
            msg = {"status": "success","form":form}
        
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

        // const updatedJob = await Job.findOneAndUpdate(
        //     { _id: id },
        //     { $set: { AccCVScore: req.body.newScore } },
        //     { new: true } 
        //   );

        const foundJob = await Job.findOne({ _id: id });

        if (!foundJob)
            msg = {"status": "error",'error':'not found'}
        else 
        {
            foundJob.AccCVScore = req.body.newScore;

            if (foundJob.noShortlisted && foundJob.noShortlisted == true)
                foundJob.noShortlisted = false;

            const updatedJob = await foundJob.save();

            msg = {"status": "success","job":updatedJob}
        }
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})


router.post("/editjobcvscore/notautomated", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const foundJob = await Job.findOne({ _id: id });

        if (!foundJob)
            msg = {"status": "error",'error':'not found'}
        else 
        {
            foundJob.AccCVScore = req.body.newScore;

            if (foundJob.noShortlisted && foundJob.noShortlisted == true)
                foundJob.noShortlisted = false;

            const updatedJob = await foundJob.save();

            msg = {"status": "success","job":updatedJob}
        }
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/editjobcvdeadline", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const foundJob = await Job.findOne({ _id: id });

        if (!foundJob)
            msg = {"status": "error",'error':'not found'}
        else 
        {
            foundJob.CVDeadline = req.body.newDeadline;

            if (foundJob.noShortlisted && foundJob.noShortlisted == true)
                foundJob.noShortlisted = false;

            const updatedJob = await foundJob.save();

            const newNotification = new Notification({
                companyname: foundJob.companyname,
                companyID: foundJob.companyID,
                jobTitle: foundJob.jobTitle,
                notifText: "Phase 1 (CV) Deadline extended to "+formatDate(req.body.newDeadline),
                recruiterUsername: foundJob.postedby,
                notifType: 1, 
                jobID: id,
              });
          
              const notification = await newNotification.save();

            msg = {"status": "success","job":updatedJob}
        }
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/editjobcvdeadline/notautomated", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const foundJob = await Job.findOne({ _id: id });

        if (!foundJob)
            msg = {"status": "error",'error':'not found'}
        else 
        {
            foundJob.CVDeadline = req.body.newDeadline;
            foundJob.shortlistedCVWaiting = false;

            if (foundJob.noShortlisted && foundJob.noShortlisted == true)
                foundJob.noShortlisted = false;

            const updatedJob = await foundJob.save();

            const newNotification = new Notification({
                companyname: foundJob.companyname,
                companyID: foundJob.companyID,
                jobTitle: foundJob.jobTitle,
                notifText: "Phase 1 Deadline extended to "+formatDate(req.body.newDeadline),
                recruiterUsername: foundJob.postedby,
                notifType: 1, 
                jobID: id,
              });
          
              const notification = await newNotification.save();

            msg = {"status": "success","job":updatedJob}
        }
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/editjobformdeadline", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: id },
            { $set: { P2FormDeadline: req.body.newDeadline,noShortlisted:false } },
            { new: true } 
          );

        if (!updatedJob)
            msg = {"status": "error",'error':'not found'}
        else {

            const updatedForm = await Form.findOneAndUpdate(
                { jobID: id },
                { $set: { formDeadline: req.body.newDeadline } },
                { new: true }
              );
            
            if (!updatedForm) 
                msg = {"status": "error",'error':'not found'}
            else
                msg = {"status": "success","job":updatedJob,"form":updatedForm}
        }
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/editjobdescription", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: id },
            { $set: { jobDescription: req.body.newJD,noShortlisted:false,jobTitle:req.body.newTitle } },
            { new: true } 
          );

        if (!updatedJob)
            msg = {"status": "error",'error':'not found'}
        else 
                msg = {"status": "success","job":updatedJob}
        } catch (error) {
            console.error('Error editing job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})



router.post("/publicizejob", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: id },
            { $set: { postjob: true } },
            { new: true } 
          );

        if (!updatedJob)
            msg = {"status": "error",'error':'not found'}
        else 
                msg = {"status": "success","job":updatedJob}
        } catch (error) {
            console.error('Error editing job:', error);
            msg = {"status": "error",'error':error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})




router.post("/checktestcreated", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const form = await TechTests.findOne({ jobID: id });

        console.log(form)

        if (!form)
            msg = {"status": "success",found:false}
        else 
            msg = {"status": "success",found:true}
        
    }
        catch (error) {
            console.error('Error finding test:', error);
            msg = {"status": "error",error: error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post("/checkvideocreated", async(req,res)=>{
    console.log(req.body);

    const id = req.body.jobId;

    var msg;

    try {

        const form = await Videos.findOne({ jobID: id });

        console.log(form)

        if (!form)
            msg = {"status": "success",found:false}
        else 
            msg = {"status": "success",found:true}
        
    }
        catch (error) {
            console.error('Error finding video:', error);
            msg = {"status": "error",error: error};

    } 
    console.log(msg);

    res.json(msg);

    res.end();

})

router.post('/getjobtest', async (req, res) => {
    try {
      const { job } = req.body;
  
      // Assuming job is an object containing _id field
      const jobID = job._id;
  
      // Find the test details based on the job ID
      const testDetails = await Videos.findOne({ jobID });
  
      if (!testDetails) {
        return res.status(404).json({ status: 'error', error: 'Test details not found' });
      }
  
      res.status(200).json({ status: 'success', test: testDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
  });

  router.post('/updatejobtest', async (req, res) => {
    try {
      const { test } = req.body;
      const { jobID } = req.params; 
  
      // Update the job test data in the database based on the jobID
      const updatedTest = await Videos.findOneAndUpdate({ jobID }, test, { new: true });
  
      if (updatedTest) {
        res.status(200).json({ status: "success", updatedTest });
      } else {
        res.status(404).json({ status: "error", error: "Job test not found" });
      }
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ status: "error", error: "Server error occurred" });
    }
  });
  

module.exports = router;