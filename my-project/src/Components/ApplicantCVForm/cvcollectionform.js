import React from 'react';
import './cvcollectionform.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import success from './success.png'
import axios from 'axios';
function CVCollectionForm() {
   
  
  const navigate=useNavigate();
  const { cvcollectionid } = useParams();
  
  const [jobDes,setJobDes] = useState("Thank you for your interest in this position. The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion."
    + "Skills Required:Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite."
  )

  const [jobID,setJobID] = useState('657d9dd3d75435064f67d066');
  const [jobrole,setJobRole] = useState("Associate Software Engineer")

  const [sentence,setSentence] = useState(<b><br></br>Please provide us with the following information so we can process your application.</b>)
  const [errorMessage, setErrorMessage] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');


  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  //Img is actually CV Here
  const [resume,setResume] = useState(''); 
  const [imgSet,setImgSet] = useState("false")
  
  const [fileTypeError, setFileTypeError] = useState(false);

  useEffect(()=>{
    
    setJobID(cvcollectionid)
    
    axios.post(`http://localhost:8000/nabeeha/getjobdetailsforcvcollection`,{"jobID":cvcollectionid}).then(res => {
          
    if (res.data.job) {
          setJobDes(res.data.job.jobDescription);
          setJobRole(res.data.job.jobTitle);
        } else {
          setErrorMessage(res.data.error);
        }
   
  
    })
    .catch(error => {
      console.error('Error:', error);
      //alert(error)
      setErrorMessage('An error occurred while fetching job details.');
    });

    if (errorMessage) {
      // Redirect to the error page or handle it as needed
      alert(errorMessage)
      navigate('/error');
    }

  }, [errorMessage, navigate])
 
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const name = firstName + " " + lastName

    
    const param = {name:name,email:email,contactNumber:contactNumber,jobID:jobID}
    
    axios.post(`http://localhost:8000/nabeeha/submitcvapplication`, param)
      .then(res => {
        setIsFormSubmitted(true);
      })
      .catch(error => {
        if (error.response && error.response.status === 500) {
          setIsError(true);
        }
      })

    upload();
    
  };

  const upload = () =>{

    // const uname = sessionStorage.getItem("sessionID");
    // const utype = sessionStorage.getItem("userType");
// alert("resume= " + resume)
    if (resume)
    {
      var fdata = new FormData();
      fdata.append("Resume", resume);
      fdata.append("email", email); //THIS SHOULD BE FROM STATE
      axios.post('http://localhost:8000/nabeeha/uploadcv',fdata) 
      .then(res => {
        // alert("Respnse" + JSON.stringify(res.data))
        // alert("CV Uploaded")

       
    })
      .catch(
        err=>{
            // alert("ERROR IN UPLOADAXIOS : "+err)
        });
    }

    
     
}
  const HandleUpload=(t)=>{
      //console.log(t.handle.files);
      
      const file = t.target.files[0];

      // Check if the uploaded file is of the allowed types
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file && !allowedTypes.includes(file.type)) {
        setFileTypeError(true);
        return;
      }
      setResume(file);
      setFileTypeError(false);
      
      // alert("setting image=" + img)
      //setImgSet("true")
      

    }
  return (
    <div id="nab-cv-outer-div">
      <div id="nab-cv-form">

      {!isFormSubmitted ? ( // Render the form if it hasn't been submitted
       <>
        <div id="nab-cv-heading">Apply for {jobrole}</div>
        <hr id="nab-cv-hr" />
        
        <label  for="fullName">{jobDes}</label>
        <label id="nab-cv-label-fullname" for="fullName">{sentence}</label>
        <hr id="nab-cv-hr" />
        <form onSubmit={handleSubmit}>
            
            
        <div id="nab-cv-fullname">
          
          <label id="nab-cv-label-fullname" for="fullName">Full Name<span id="nab-cv-required-field">*</span>:</label>
          
          <div id="nab-cv-fullname-div">
            
            <div id="nab-form-group1">
                {/* <input id="nab-cv-input1" type="text" name="firstName" placeholder='First Name'required /> */}
                <input
                  id="nab-cv-input1"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
            </div>

            <div id="nab-form-group2">
            <input
                  type="text"
                  id="nab-cv-input2"
                  name="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
            </div>
          
          </div>
      </div>

            <div id="nab-form-group">
                <label id="nab-cv-label" for="email">Email<span id="nab-cv-required-field">*</span>:</label>
                <input
                  type="email"
                  id="nab-cv-input"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>

            <div id="nab-form-group">
                <label id="nab-cv-label" for="contactNumber">Contact Number<span id="nab-cv-required-field">*</span>:</label>
                <input
                  type="tel"
                  id="nab-cv-input"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
            </div>

            <div id="nab-form-group">
                <label id="nab-cv-label" for="cvFile">Upload your updated CV. Please note CV with graphics will not be accepted.<span id="nab-cv-required-field">*</span>:</label>
                <div id="nab-upload-btn-wrapper">
                    
                <input
                    type="file"
                    name="cvFile"
                    id="nab-cv-input"
                    accept=".pdf,.docx"
                    onChange={HandleUpload}
                    required
                  />
                </div>
            </div>

            
            <div>
            {fileTypeError && <p style={{ color: 'red' }}>Invalid file type. Please upload a PDF or DOCX file.</p>}
              {isError && <p style={{ color: 'red' }}>Something went wrong. Please try again later.</p>}
            </div>
            <button type="submit" id="nab-cv-button" disabled={fileTypeError}>Submit</button>
            
        </form>
        </>
        ) : ( // Render success message if form is submitted successfully
          <div id="form-success-message">
            <img src={success}></img>
            <p>Your application for {jobrole} has been received successfully. We will get back to you soon.</p>
          </div>
        )}
    </div>
    
    </div>
  );
}

export default CVCollectionForm;
