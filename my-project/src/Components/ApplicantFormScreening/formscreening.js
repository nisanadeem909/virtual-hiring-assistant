import React from 'react';
import './formscreening.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';
import FormQuestion from './formquestion.js'
import { useState } from 'react';
export default function FormScreening() {
 // const navigate=useNavigate();

  const [jobrole,setJobRole] = useState("Associate Software Engineer")
  return (
    <div id="nab-form-outer-div">
      <div id="nab-form">
        
        <div id="nab-form-heading">Recruitment Phase 2: Form Screening for {jobrole} </div>
        
        <hr id="nab-form-hr" />
        
        <form>
            <div id="nab-formcoll-group">
                <label id="nab-form-label" for="email">Email<span id="nab-form-required-field">*</span>:</label>
                <input type="email" id="nab-form-input" name="email" required/>
            </div>
            <hr id="nab-form-hr" />
            <div id="nab-formcoll-group">
                
                <label id="nab-form-label" >Tell us a little about yourself.</label>
    
            </div>

            <div id="nab-form-all-questions">
              <div id="nab-q1">
                <FormQuestion  statement={"Have you graduated yet?"} answer1={"Yes, I have graduated"} answer2={"No, I have not graduated yet"}/>
              </div>

              <div id="nab-q1">
                <FormQuestion statement={"How much experience do you have with ReactJS?"} answer1={"1 year or less experience"} answer2={"More than 1 year experience"}/>
              </div>
              
              
              <div id="nab-q1">
              <FormQuestion statement={"Are you willing to work onsite in our Lahore office?"}answer1={"Yes, I am willing to relocate"} answer2={"No, I cannot move to Lahore"}/> 
              </div>
              
            </div>
            

            <button type="submit" id="nab-cv-button">Submit</button>
        </form>
    </div>
    </div>
  );
}


