import React, { useState } from 'react' 
import './formcollectionemail.css';

export default function FormCollectionEmailComponent() {

    const [jobTitle,setJobTitle] = useState("Graphic Designer");
    const [company,setCompany] = useState("Manafa Technologies");
    //const [link,setLink] = useState('<href>http://localhost:3000/applicant/formcollection</href>')
    const link = '<a href="http://localhost:3000/applicant/formcollection">Click here to access the form</a>';
    const [defaultEmail,setEmail] = useState("Dear <name>, \n\nYour application for "+ jobTitle+ " role at "+ company+ " has successfully passed Phase 1 of our recruitment.\n\nFor Phase 2, we require candidates to answer a few important questions about their role at our company. \n\nPlease find attached the link to the Form. Please submit it within 2 days of receiving it. \n\n" + link + "\n\nLooking forward for your response. \n\nBest regards, \n\nRecruitment Team \n"+ company);
    
    const [emailSubject, setSubject] = useState("Regarding Your Application for "+ jobTitle+ " at "+ company);
    
    const handleLinkClick = () => {
      // Handle the link click, for example, navigate to the link
      window.location.href = link;
    };
    const handleEmailSubjectChange = (event) => {
        setSubject(event.target.value);
      };
    
      const handleDefaultEmailChange = (event) => {
        setEmail(event.target.value);
      };

    return (
      <div className='krejemail-container'>
          <div className='krejemail-header'>
                <label className='krejemail-header-title'>Set Phase 2: Form Screening Email </label>
                <hr></hr>
                <label className='krejemail-header-desc'>This will be the default email that will be sent to all candidates who passed Phase 1.</label>
          </div>
          <div className='krejemail-main'>
            <label><b>Job Title:</b> {jobTitle}</label>
            <div className='krejemail-email'>
                <label><b>Email Subject:</b></label>
                <input type="text" value={emailSubject} className='krejemail-textbox' onChange={handleEmailSubjectChange}></input>
                <label><b>Email Body:</b></label>
                <textarea className='krejemail-textarea' value={defaultEmail} onChange={handleDefaultEmailChange}><div dangerouslySetInnerHTML={{ __html: link }} /></textarea> 
                  {/* <div dangerouslySetInnerHTML={{ __html: defaultEmail }} />
                  <a href={link} onClick={handleLinkClick}>Click here to access the form</a> */}
            </div>
            <div className='krejemail-buttons'>
                <button className='krejemail-save-btn'>Save</button>
                <button className='krejemail-cancel-btn'>Cancel</button>
            </div>
          </div>
      </div>
    )
  }