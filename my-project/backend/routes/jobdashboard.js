const express = require('express');
const router = express.Router();
const {Job, Recruiter,JobApplication,Form,Notification,TechTests,Videos,TestResponses,VideosResponses,FormResponses} = require('../mongo');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    port: 465,
    host:"smtp.gmail.com",
    auth: {
    user: 'virtualhiringassistant04@gmail.com',
    pass: 'glke rmyu xnfa yozn'
    },
    secure: true,
    });

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
    

    res.json(msg);

    res.end();

})

router.post("/getjobform", async(req,res)=>{


    const id = req.body.job;

    var msg;

    try {

        const form = await Form.findOne({ jobID: id });

       

        if (!form)
            msg = {"status": "error",error:"not found"}
        else 
            msg = {"status": "success","form":form}
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error"};

    } 
    

    res.json(msg);

    res.end();

})

router.post("/editjobcvscore", async(req,res)=>{
    

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
   

    res.json(msg);

    res.end();

})


router.post("/editjobcvscore/notautomated", async(req,res)=>{
    

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
   

    res.json(msg);

    res.end();

})

router.post("/editjobcvdeadline", async(req,res)=>{


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
    

    res.json(msg);

    res.end();

})

router.post("/editjobcvdeadline/notautomated", async(req,res)=>{
   
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
   

    res.json(msg);

    res.end();

})

router.post("/editjobformdeadline", async(req,res)=>{
   

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


    res.json(msg);

    res.end();

})

router.post("/editjobdescription", async(req,res)=>{
    

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


    res.json(msg);

    res.end();

})



router.post("/publicizejob", async(req,res)=>{
    

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
    

    res.json(msg);

    res.end();

})




router.post("/checktestcreated", async(req,res)=>{
    

    const id = req.body.jobId;

    var msg;

    try {

        const form = await TechTests.findOne({ jobID: id });

       

        if (!form)
            msg = {"status": "success",found:false}
        else 
            msg = {"status": "success",found:true}
        
    }
        catch (error) {
            console.error('Error finding test:', error);
            msg = {"status": "error",error: error};

    } 
  

    res.json(msg);

    res.end();

})

router.post("/checkvideocreated", async(req,res)=>{
  

    const id = req.body.jobId;

    var msg;

    try {

        const form = await Videos.findOne({ jobID: id });

      

        if (!form)
            msg = {"status": "success",found:false}
        else 
            msg = {"status": "success",found:true}
        
    }
        catch (error) {
            console.error('Error finding video:', error);
            msg = {"status": "error",error: error};

    } 
   

    res.json(msg);

    res.end();

})

router.post("/editp3days", async(req,res)=>{
   

    const jobId = req.body.jobId;
    const newP3Days = req.body.newDays;

    var msg;

    try {

        const job = await Job.findOneAndUpdate(
            { _id: jobId },
            { $set: { P3Days: newP3Days } },
            { new: true } // Return the updated document
          );

        if (!job)
            msg = {"status": "error",error:"Job not found!"}
        else {
            await Videos.findOneAndUpdate(
                { jobID: jobId },
                { $set: { days: newP3Days } },
                { new: true } 
            );

            await TechTests.findOneAndUpdate(
                { jobID: jobId },
                { $set: { days: newP3Days } },
                { new: true }
            );

            const newNotification = new Notification({
                companyname: job.companyname,
                companyID: job.companyID,
                jobTitle: job.jobTitle,
                notifText: "Days for interview/test link to remain open extended to "+newP3Days,
                recruiterUsername: job.postedby,
                notifType: 3, 
                jobID: job._id,
              });
          
              const notification = await newNotification.save();

            msg = {"status": "success",job:job}
        }
        
    }
        catch (error) {
            console.error('Error adding job:', error);
            msg = {"status": "error"};

    } 
    

    res.json(msg);

    res.end();

})

router.post('/getjobtestnisa', async(req, res) => {
    try {
       
      const jobID = req.query.jobID;
     
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

  router.post('/updatejobtestnisa/:jobID', async (req, res) => {
    try {
      console.log("=============HI==================");
      console.log(req.body);
      // Extract the test object from the request body
      const { test } = req.body;

      // Extract the fields from the test object
      const { questions, duration, acceptabilityTraits, importance } = test;
      const { jobID } = req.params;
      
      console.log(questions)
        console.log(duration)
      const updatedTest = await Videos.findOneAndUpdate({ jobID }, { $set: { questions, duration, acceptabilityTraits, importance } }, { new: true });
      
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






  // shortlisting routes


  router.post("/setacceptanceemail", async (req, res) => {
    const { jobId, acceptEmailSub, acceptEmailBody } = req.body;
    let msg;

    console.log(req.body);

    try {
        // Find the job by ID and update the acceptEmailSub and acceptEmailBody fields
        const job = await Job.findOneAndUpdate(
            { _id: jobId },
            { 
                $set: { 
                    acceptEmailSub: acceptEmailSub,
                    acceptEmailBody: acceptEmailBody
                }
            },
            { new: true } // Return the updated document
        );

        if (!job) {
            msg = { "status": "error", "error": "Job not found!" };
        } else {
            msg = { "status": "success", "job": job };
        }
    } catch (error) {
        console.error('Error updating job:', error);
        msg = { "status": "error", "error": error.message };
    }

    res.json(msg);
    res.end();
});

router.post("/getacceptanceemail", async (req, res) => {
    const { jobId } = req.body;
    let msg;


    console.log("Getting acceptance email: "+jobId);

    try {
        // Find the job by ID
        const job = await Job.findById(jobId, 'acceptEmailSub acceptEmailBody');

        if (!job) {
            msg = { "status": "error", "error": "Job not found!" };
        } else if (!job.acceptEmailSub && !job.acceptEmailBody) {
            msg = { "status": "not found", "error": "Acceptance email details not found!" };
        } else {
            msg = { 
                "status": "success", 
                "email": job.acceptEmailBody 
            };
        }
    } catch (error) {
        console.error('Error fetching job:', error);
        msg = { "status": "error", "error": error.message };
    }

    res.json(msg);
    res.end();
});

router.post("/getshortlistedapplications", async (req, res) => {
    const { jobID } = req.body;

    try {
        // Find all job applications for the given jobID whose status is 3, 5, or -5
        const applications = await JobApplication.find({
            jobID: jobID,
            status: { $in: [3, 5, -5] }
        }).lean();

        if (!applications.length) {
            return res.json({ "status": "error", "error": "No shortlisted applications found!" });
        }

        // Get video importance for the job
        const video = await Videos.findOne({ jobID: jobID }, 'importance').lean();
        const videoImportance = video ? video.importance : 50;

        const techTest = await TechTests.findOne({ jobID: jobID }, 'questions').lean();
        const testTotalPoints = techTest ? calculateTestTotalPoints(techTest.questions) : 1;

        // Populate each application with test and video scores and calculate final score
        const applicationDetails = await Promise.all(applications.map(async (application) => {
            const testResponse = await TestResponses.findOne({ applicantEmail: application.email, jobID: jobID }, 'overallScore').lean();
            const videoResponse = await VideosResponses.findOne({ applicantEmail: application.email, jobID: jobID }, 'overallScore status').lean();

            // Check if video response status is 'missing' and test response does not exist
            if (videoResponse?.status === 'missing' && !testResponse) {
                // Update status to -3
                await JobApplication.updateOne({ _id: application._id }, { $set: { status: -3 } });
                return null;
            }

            // Calculate final score
            const finalScore = calculateFinalScore(testResponse ? testResponse.overallScore : 0, testTotalPoints, videoResponse ? videoResponse.overallScore : 0, videoImportance);

            return {
                ...application,
                testOverallScore: testResponse ? testResponse.overallScore : 0,
                videoOverallScore: videoResponse ? videoResponse.overallScore : 0,
                finalScore: finalScore
            };
        }));

        // Filter out null entries from the applicationDetails array
        const filteredApplicationDetails = applicationDetails.filter(application => application !== null);

        filteredApplicationDetails.sort((a, b) => b.finalScore - a.finalScore);

        console.log(filteredApplicationDetails);

        res.json({ "status": "success", "applications": filteredApplicationDetails });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.json({ "status": "error", "error": error.message });
    }
});



function calculateFinalScore(testOverallScore, testTotalPoints, videoOverallScore, videoImportance) {
    const finalScore = ((testOverallScore/testTotalPoints * (100 - videoImportance) / 100) + (videoOverallScore/9 * videoImportance / 100)) * 100;
    return finalScore;
}

function calculateTestTotalPoints(questions) {
    return questions.reduce((total, question) => total + (question.points || 0), 0);
}


router.post("/acceptcandidate", async (req, res) => {
    const { selectedApps, jobApps } = req.body;
    let msg;

    try {
        if (!Array.isArray(selectedApps) || selectedApps.length === 0) {
            throw new Error("Invalid job applications list.");
        }

        const updated = await Promise.all(selectedApps.map(async (applicationId) => {
            const updatedApplication = await JobApplication.findOneAndUpdate(
                { _id: applicationId },
                { $set: { status: 5 } },
                { new: true } 
            );
            if (!updatedApplication) {
                throw new Error(`Job application with ID ${applicationId} not found.`);
            }
            return updatedApplication;
        }));

        const updatedApplications = jobApps.map(application => {
            const selectedApp = selectedApps.find(app => app._id === application._id);
            if (selectedApp) {
                return { ...application, status: 5 };
            } else {
                return application;
            }
        });

        console.log("**********************************************\n\n\n\n\n\n\n")
        console.log(updatedApplications)
        console.log("**********************************************\n\n\n\n\n")

        const jobId = selectedApps[0].jobID;
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error("Job not found.");
        }

        Promise.all(selectedApps.map(async (selectedApp) => {
            const mailOptions = {
                from: 'virtualhiringassistant04@gmail.com',
                to: selectedApp.email,
                subject: job.acceptEmailSub, 
                text: job.acceptEmailBody 
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }));

        msg = {
            "status": "success",
            "updatedApplications": updatedApplications
        };
    } catch (error) {
        console.error('Error accepting candidates:', error);
        msg = { "status": "error", "error": error.message };
    }

    res.json(msg);
    res.end();
});


router.post("/rejectcandidate", async (req, res) => {
    const { selectedApps, jobApps } = req.body;
    let msg;

    try {
        if (!Array.isArray(selectedApps) || selectedApps.length === 0) {
            throw new Error("Invalid job applications list.");
        }

        const updated = await Promise.all(selectedApps.map(async (applicationId) => {
            const updatedApplication = await JobApplication.findOneAndUpdate(
                { _id: applicationId },
                { $set: { status: -5 } },
                { new: true } 
            );
            if (!updatedApplication) {
                throw new Error(`Job application with ID ${applicationId} not found.`);
            }
            return updatedApplication;
        }));

        const updatedApplications = jobApps.map(application => {
            const selectedApp = selectedApps.find(app => app._id === application._id);
            if (selectedApp) {
                return { ...application, status: -5 };
            } else {
                return application;
            }
        });

        console.log("**********************************************\n\n\n\n\n\n\n")
        console.log(updatedApplications)
        console.log("**********************************************\n\n\n\n\n")

        const jobId = selectedApps[0].jobID; 
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error("Job not found.");
        }

        let emailBody = job.rejectEmailBody + "\n\nBest of luck for your future endeavours!\n\n"

        Promise.all(selectedApps.map(async (selectedApp) => {
            const mailOptions = {
                from: 'virtualhiringassistant04@gmail.com',
                to: selectedApp.email,
                subject: job.acceptEmailSub, 
                text: emailBody 
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }));

        msg = {
            "status": "success",
            "updatedApplications": updatedApplications
        };
    } catch (error) {
        console.error('Error rejecting candidates:', error);
        msg = { "status": "error", "error": error.message };
    }

    res.json(msg);
    res.end();
});





router.post("/getJobApplicationStatistics", async (req, res) => {
    const { job } = req.body;
    const jobID = job._id;
    const AccCVScore = job.AccCVScore;

    console.log("\n\n\n\n\nSTATSSS")
    console.log(job)

    try {
        const totalApplications = await JobApplication.countDocuments({ jobID });

        const cvScoreGreaterThanAcceptable = await JobApplication.countDocuments({ jobID:jobID, 'CVMatchScore': { $gt: AccCVScore } });

        const shortlistedFormResponses = await FormResponses.countDocuments({ jobID:jobID, 'status': "Shortlisted" });

        const totalVideoResponses = await VideosResponses.countDocuments({ 
            jobID: jobID, 
            status: { $ne: 'missing' }
          });
          

        const totalTestResponses = await TestResponses.countDocuments({ jobID:jobID });

        const applicationsShortlisted = await JobApplication.find({ 
            jobID: jobID, 
            status: { $in: [3, 5, -5] } 
        }).lean();

        const totalShortlistedApplications = applicationsShortlisted.length;

        res.json({
            "status": "success",
            "statistics": [
                totalApplications,
                cvScoreGreaterThanAcceptable,
                shortlistedFormResponses,
                totalVideoResponses,
                totalTestResponses,
                totalShortlistedApplications
            ]
        });
    } catch (error) {
        console.error('Error fetching job application statistics:', error);
        res.json({ "status": "error", "error": error.message });
    }
});



  /////////////////////////////////
  

module.exports = router;