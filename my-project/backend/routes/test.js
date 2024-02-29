const express = require('express');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const cors=require('cors');
const {Job, Recruiter,JobApplication,Form, Company} = require('../mongo');
router.use(express.static('files'));
const path = require('path');
router.use("/static",express.static(path.join(__dirname,'public')));

router.use(express.static('public'));
router.use('/questionimages', express.static('questionimages'));
router.use('/questionimages', express.static(path.join(__dirname, 'questionimages')));







router.post('/uploadquestionpic', function(req,res){
    // var name = req.body.name;
    console.log(req.body)
    try{
    
     var form = new formidable.IncomingForm();
     var newpath;
     form.parse(req,async function(err,fields,files){
         console.log(files.Image)
         var oldpath = String(files.Image.filepath); //this was files.Image.filepath
         //console.log(oldpath);
         const img_file = files.Image.originalFilename;
         console.log("original file name = " + img_file);
  
       
         newpath = String(__dirname + '/profilepictures/' + files.Image.originalFilename);
         
         console.log("old path = " + oldpath);
         console.log("new path = " + newpath);
         
         /*fs.copyFile(oldpath,newpath,function(err){
             console.log("I AM HERE");
             if(err) throw err;
             console.log("File uploaded and moved");
         });*/
  
         try {
          fs.copyFileSync(oldpath,newpath);
         }
         catch (err) {
            console.log(err);
         }
         
         //console.log(fields.UserType + " " + fields.Username);
         var pathpfp = newpath;


         var uname = fields.username;
         console.log("username: " + uname)
         
           
   
  
        });
     res.json({data:{NewPath: newpath}});
     res.end();
        

    }
    catch(ex)
    {
        console.log("unexpected error")
    }
      
  });   


  module.exports = router;