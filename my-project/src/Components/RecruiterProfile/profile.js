import React from 'react';
import './profile.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';
import profilepic from './profilepic.jpeg'
import { useState } from 'react';
export default function Profile() {
 // const navigate=useNavigate();
    const [fullName,setFullName] = useState("Muhammad Mudassir")
    const [email,setEmail] = useState("muhammad@example.com") 
    const [contact,setContact] = useState("1234-567890") 
    const [jobDes,setJobDes] = useState("Head Talent Acquisition")  
 
 
 return (
    <div>
        <div id="nab-profile-outer-div">
            <div id="nab-profile-pic">
                        <img id="nab-pic-circle" src={profilepic}></img>
                        <div className="profile-info">
                            <div><button id="change-prof-pic">Upload Picture</button></div>
                            <br></br>
                            <div className="profile-name">{fullName}</div>
                            <div className="profile-email">{email}</div>
                        </div>
                      
            </div>
            <div id="nab-profile-details">
                    <label id="profile-settings">Profile Settings</label>
                    <hr></hr>
                    <div className="profile-field-firstname">
                        <label id="nab-profile-label" for="email">Full Name</label>
                        <input type="email" id="nab-profile-input" name="email" value={fullName} required/>
                    </div>
                    
                    <div className="profile-field">
                        <label id="nab-profile-label" for="email">Email</label>
                        <input type="email" id="nab-profile-input" name="email"value={email} required/>
                    </div>
                    <div className="profile-field">
                        <label id="nab-profile-label" for="email">Contact Number</label>
                        <input type="email" id="nab-profile-input" name="email" value={contact} required/>
                    </div>
                    <div className="profile-field">
                            <label id="nab-profile-label" for="email">Job Designation</label>
                            <input type="email"id="nab-profile-input" name="email" value={jobDes} required/>
                    </div>

                    <button type="submit" id="nab-profile-button">Save</button>
            </div>

            
        </div>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
         <div className="ft"> <Footer />        </div> 

        
    </div>
  );
}


