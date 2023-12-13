import React from 'react';
import './cvcollectionform.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function CVCollectionForm() {
 // const navigate=useNavigate();

 
 const [jobrole,setJobRole] = useState("Associate Software Engineer")
  return (
    <div id="nab-cv-outer-div">
      <div id="nab-cv-form">
        <div id="nab-cv-heading">Recruitment Phase 1: CV Collection for {jobrole}</div>
        <hr id="nab-cv-hr" />
        <form>
            
            
        <div id="nab-cv-fullname">
          
          <label id="nab-cv-label-fullname" for="fullName">Full Name<span id="nab-cv-required-field">*</span>:</label>
          
          <div id="nab-cv-fullname-div">
            
            <div id="nab-form-group1">
                <input id="nab-cv-input1" type="text" name="firstName" required />
                <span id="nab-cv-label-below-firstname">First Name</span>
            </div>

            <div id="nab-form-group2">
                <input type="text" id="nab-cv-input2" name="lastName" required />
                <span id="nab-cv-label-below-lastname">Last Name</span>
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
