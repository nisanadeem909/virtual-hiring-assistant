import React, { useState } from 'react' 
import './formcollectionemail.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function FormCollectionEmailComponent() {

  const location = useLocation();
  const jobID = location.state.jobID;
    const [jobTitle,setJobTitle] = useState("Graphic Designer");
    const [company,setCompany] = useState("Manafa Technologies");
    //const [link,setLink] = useState('<href>http://localhost:3000/applicant/formcollection</href>')
    const link = '<a href="http://localhost:3000/applicant/formcollection">Click here to access the form</a>';
    const [formEmailBody,setEmail] = useState("Dear <name>, \n\nYour application for "+ jobTitle+ " role at "+ company+ " has successfully passed Phase 1 of our recruitment.\n\nFor Phase 2, we require candidates to answer a few important questions about their role at our company. \n\nPlease find attached the link to the Form. Please submit it within 2 days of receiving it. \n\n" + link + "\n\nLooking forward for your response. \n\nBest regards, \n\nRecruitment Team \n"+ company);
    const [savedJobId, setSavedJob] = useState();
    const [formEmailSub, setSubject] = useState("Regarding Your Application for "+ jobTitle+ " at "+ company);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleLinkClick = () => {
      // Handle the link click, for example, navigate to the link
      window.location.href = link;
    };

    const handleSave = async() => {

      alert(jobID)
      try {
        const response = await axios.post(`http://localhost:8000/nisa/api/emailForm/${jobID}`, {
          formEmailSub,
          formEmailBody,
        });
  
        console.log('Updated:', response.data);
        setShowModal(true);
        setSavedJob(jobID);
      } catch (error) {
        console.error('Error updating emails and form:', error);
      }
    };
    const handleEmailSubjectChange = (event) => {
        setSubject(event.target.value);
      };
    
      const handleDefaultEmailChange = (event) => {
        setEmail(event.target.value);
      };

      const handleModalClose = () => {
        
        setShowModal(false);
        navigate('/recruiter/home/postjob/setemail', { state: { savedJobId } });
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
                <input type="text" value={formEmailSub} className='krejemail-textbox' onChange={handleEmailSubjectChange}></input>
                <label><b>Email Body:</b></label>
                <textarea className='krejemail-textarea' value={formEmailBody} onChange={handleDefaultEmailChange}><div dangerouslySetInnerHTML={{ __html: link }} /></textarea> 
                  {/* <div dangerouslySetInnerHTML={{ __html: defaultEmail }} />
                  <a href={link} onClick={handleLinkClick}>Click here to access the form</a> */}
            </div>
            <div className='krejemail-buttons'>
                <button className='krejemail-save-btn' onClick={handleSave}>Save</button>
                <button className='krejemail-cancel-btn' onClick={() => navigate('/recruiter/home/postjob/setemail', { state: { savedJobId } })} >Cancel</button>
            </div>
          </div>
          {showModal && (
        <div className='modal' style={{ display: 'block' }}>
          <p className='nisa-modal'>Email saved successfully!</p>
          <button onClick={handleModalClose}>Close</button>
        </div>
      )}
      </div>
    )
  }