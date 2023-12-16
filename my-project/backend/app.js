const {Job, Recruiter,JobApplication,Form} = require('./mongo');
const fs = require('fs');
const formidable = require('formidable');
const cors=require('cors');
const directoryPath = './images';
const express = require('express');
var app =express();
app.use(cors());
app.use(express.static('public'));
app.use('/profilepictures', express.static('profilepictures'));
app.use('/resumes', express.static('resumes'));
app.use(express.static('backend/profilepictures'));
app.use('/images', express.static('uploads'));
app.use(express.static('files'));
const path = require('path');
app.use("/static",express.static(path.join(__dirname,'public')));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const cookieParser = require("cookie-parser");


app.use(cookieParser());

const session = require('express-session');
app.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));

app.post("/getjob", async(req,res)=>{
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

app.post("/createform", async(req,res)=>{
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

app.listen(8000, () => {
    console.log("Server is running on port 8000"); 
})