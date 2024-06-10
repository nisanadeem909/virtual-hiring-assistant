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
router.use('/profilepictures', express.static('profilepictures'));
router.use('/profilepictures', express.static(path.join(__dirname, 'profilepictures')));

router.post('/editprofile-getdetails', async (req, res) => {
    try {
      
     
      const user = await Recruiter.findOne({ username: req.body.username });
     console.log(user)
      if (user) {
          res.json({ user });
          
      } else {
          res.json({ error: 'Loading...' });
          console.log("User not found");
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
  
    res.end();
  
});

router.post('/editprofile-getdetails-company', async (req, res) => {
    try {
      
     
      const user = await Company.findOne({ username: req.body.username });
     console.log(user)
      if (user) {
          res.json({ user });
          
      } else {
          res.json({ error: 'Loading...' });
          console.log("User not found");
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
  
    res.end();
  
});

router.post('/editprofile-updatedetails', async (req, res) => {
    console.log(req.body)
    const { username, updatedDetails } = req.body;

    try {
        const updatedUser = await Recruiter.findOneAndUpdate(
            { username: username },
            { $set: updatedDetails },
            { new: true } // Return the updated document
        );

      
        if (updatedUser) {
            res.status(200).json({ user: updatedUser, message: 'User details updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/uploadprofilepic', function(req,res){
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
         
           
         try {
            const result = await Recruiter.findOneAndUpdate(
              { username: uname },
              { $set: { profilePic: img_file } },
              { new: true, overwrite: false }
            );
          
            if (!result) {
              console.log('Recruiter not found for the given username');
              // Handle the case where the recruiter with the given username is not found
            } else {
              console.log('Profile picture updated successfully:', result);
              // Handle success, if needed
            }
          } catch (error) {
            console.error('Error updating profile picture:', error);
            // Handle the error
          }
        
        
         
     });
     //res.write("Hello");
     
     //res.json({Status:"Received"});
  
     res.json({data:{NewPath: newpath}});
     res.end();

    }
    catch(ex)
    {
        console.log("unexpected error")
    }
      
  });   

  

router.post('/editprofile-updatedetails-company', async (req, res) => {
    console.log(req.body)
    const { username, updatedDetails } = req.body;

    try {
        const updatedUser = await Company.findOneAndUpdate(
            { username: username },
            { $set: updatedDetails },
            { new: true } // Return the updated document
        );

      
        if (updatedUser) {
            res.status(200).json({ user: updatedUser, message: 'User details updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/uploadprofilepic-company', function(req,res){
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
         
           
         try {
            const result = await Company.findOneAndUpdate(
              { username: uname },
              { $set: { profilePic: img_file } },
              { new: true, overwrite: false }
            );
          
            if (!result) {
              console.log('Company not found for the given username');
              // Handle the case where the recruiter with the given username is not found
            } else {
              console.log('Profile picture updated successfully:', result);
              // Handle success, if needed
            }
          } catch (error) {
            console.error('Error updating profile picture:', error);
            // Handle the error
          }
        
        
         
     });
     //res.write("Hello");
     
     //res.json({Status:"Received"});
  
     res.json({data:{NewPath: newpath}});
     res.end();

    }
    catch(ex)
    {
        console.log("unexpected error")
    }
      
  });   

  router.post('/getprofilepic',async(req,res)=>{
      
      try {
          const user = await Recruiter.findOne({ username: req.body.username });
          if (user) { 
              res.json({ profilePic: user.profilePic });
              
          } else { 
              res.json({ error: 'Loading...' });
              console.log("Profile Pic not found");
          }
      } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Internal server error' });
      }
      
        res.end();
  })  

  router.post('/getprofilepic-company',async(req,res)=>{
      
      try {
          const user = await Company.findOne({ username: req.body.username });
          if (user) { 
              res.json({ profilePic: user.profilePic });
              
          } else { 
              res.json({ error: 'Loading...' });
              console.log("Profile Pic not found");
          }
      } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Internal server error' });
      }
      
        res.end();
  })
  
module.exports = router;