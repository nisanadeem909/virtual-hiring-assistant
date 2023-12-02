import React, { useState } from 'react' 
import './RejectionEmail.css';

export default function RejectionEmailPage() {

    const [defaultEmail,setEmail] = useState("Dear <Applicant's Name>, \n\nThank you for your interest in the <Job Title> role at <Company>. We appreciate the time and effort you invested in your application. \n\nAfter careful consideration, we regret to inform you that we have chosen another candidate for this position. While we were impressed with your qualifications, the competition was high. \n\nWe will keep your resume for future opportunities that match your skills. Please continue to check our career page for new openings. \n\nWe wish you the best in your job search and future endeavors. \n\nBest regards, \n\n<Name> \n<Designation> \n<Company>");
    const [jobTitle,setJobTitle] = useState("Graphic Designer");
    const [emailSubject, setSubject] = useState("Regarding Your Application for <Position> at <Company>");

    const handleEmailSubjectChange = (event) => {
        setSubject(event.target.value);
      };
    
      const handleDefaultEmailChange = (event) => {
        setEmail(event.target.value);
      };

    return (
      <div className='krejemail-container'>
          <div className='krejemail-header'>
                <label className='krejemail-header-title'>Set Rejection Email</label>
                <hr></hr>
                <label className='krejemail-header-desc'>This will be the default email that will be sent to all rejected candidates in each phase.</label>
          </div>
          <div className='krejemail-main'>
            <label><b>Job Title:</b> {jobTitle}</label>
            <div className='krejemail-email'>
                <label><b>Email Subject:</b></label>
                <input type="text" value={emailSubject} className='krejemail-textbox' onChange={handleEmailSubjectChange}></input>
                <label><b>Email Body:</b></label>
                <textarea className='krejemail-textarea' value={defaultEmail} onChange={handleDefaultEmailChange}></textarea>
            </div>
            <div className='krejemail-buttons'>
                <button className='krejemail-save-btn'>Save</button>
                <button className='krejemail-cancel-btn'>Cancel</button>
            </div>
          </div>
      </div>
    )
  }