import React from 'react';
import './cvcollectionform.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';


function CVCollectionForm() {
 // const navigate=useNavigate();
  const { cvcollectionid } = useParams();
  
  const [jobDes,setJobDes] = useState("Thank you for your interest in this position. The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion."
    + "Skills Required:Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite."
  )

  const [jobID,setJobID] = useState('657d8450b8b282677e3d4942');
  const [jobrole,setJobRole] = useState("Associate Software Engineer")

  useEffect(()=>{
    //const numbersAtEnd = cvcollectionID.match(/\d+$/);
    alert('Job ID:'+ cvcollectionid);
    // alert("hi")

    // setJobDes First here

    // setJobRole here
  },[])
 
  return (
    <div id="nab-cv-outer-div">
      <div id="nab-cv-form">
        <div id="nab-cv-heading">Apply for {jobrole}</div>
        <hr id="nab-cv-hr" />
        
        <label id="nab-cv-label-fullname" for="fullName">{jobDes}<span id="nab-cv-required-field"></span>:</label>
        
        <hr id="nab-cv-hr" />
        <form>
            
            
        <div id="nab-cv-fullname">
          
          <label id="nab-cv-label-fullname" for="fullName">Full Name<span id="nab-cv-required-field">*</span>:</label>
          
          <div id="nab-cv-fullname-div">
            
            <div id="nab-form-group1">
                <input id="nab-cv-input1" type="text" name="firstName" placeholder='First Name'required />
                {/* <span id="nab-cv-label-below-firstname">First Name</span> */}
            </div>

            <div id="nab-form-group2">
                <input type="text" id="nab-cv-input2" name="lastName" required placeholder='Last Name'/>
                {/* <span id="nab-cv-label-below-lastname">Last Name</span> */}
            </div>
          
          </div>
      </div>

            <div id="nab-form-group">
                <label id="nab-cv-label" for="email">Email<span id="nab-cv-required-field">*</span>:</label>
                <input type="email" id="nab-cv-input" name="email" required/>
            </div>

            <div id="nab-form-group">
                <label id="nab-cv-label" for="contactNumber">Contact Number<span id="nab-cv-required-field">*</span>:</label>
                <input type="tel" id="nab-cv-input" name="contactNumber" required/>
            </div>

            <div id="nab-form-group">
                <label id="nab-cv-label" for="cvFile">Upload CV<span id="nab-cv-required-field">*</span>:</label>
                <div id="nab-upload-btn-wrapper">
                    
                    <input type="file" name="cvFile" id="nab-cv-input" accept=".pdf,.docx" required/>
                </div>
            </div>

            

            <button type="submit" id="nab-cv-button">Submit</button>
        </form>
    </div>
    </div>
  );
}

export default CVCollectionForm;
