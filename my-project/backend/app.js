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


const createFormRoute = require('./routes/createform');
const JobDashboardRoute = require('./routes/jobdashboard');
const EditProfileRoute = require('./routes/editprofile');
const LoginRoute = require('./routes/login');
const SignupRoute = require('./routes/signup');
const JobListRoute = require('./routes/joblist');
const PostJobRoute = require('./routes/postjob');
const LogoutRoute = require('./routes/logout');

app.use('/komal', createFormRoute);
app.use('/komal', JobDashboardRoute);
app.use('/komal', LogoutRoute);
app.use('/nabeeha', EditProfileRoute);
app.use('/nisa', LoginRoute);
app.use('/nisa', SignupRoute);
app.use('/nisa', JobListRoute);
app.use('/nisa', PostJobRoute);


app.use(cookieParser());

const session = require('express-session');
app.use(session({
 secret: '123456',
 resave: true,
 saveUninitialized: true,
 
}));


app.listen(8000, () => {
    console.log("Server is running on port 8000"); 
})