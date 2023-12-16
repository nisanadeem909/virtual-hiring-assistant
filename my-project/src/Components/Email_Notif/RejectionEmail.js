import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RejectionEmail.css';
import axios from 'axios';

export default function RejectionEmailPage({ data }) {
  const [jobTitle, setJobTitle] = useState("Graphic Designer");
  const [company, setCompany] = useState("Manafa Technologies");
  const [rejectEmailBody, setEmail] = useState("Dear <name>, \n\nThank you for your interest in the " + jobTitle + " role at " + company + ". We appreciate the time and effort you invested in your application. \n\nAfter careful consideration, we regret to inform you that we have chosen another candidate for this position. While we were impressed with your qualifications, the competition was high. \n\nWe will keep your resume for future opportunities that match your skills. Please continue to check our career page for new openings. \n\nWe wish you the best in your job search and future endeavors. \n\nBest regards, \n\nRecruitment Team \n" + company);
  const [rejectEmailSub, setSubject] = useState("Regarding Your Application for " + jobTitle + " at " + company);
  const [showModal, setShowModal] = useState(false);
  const [savedJobId, setSavedJob] = useState("Manafa Technologies");
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/nisa/api/updateEmailsAndForm/${data}`, {
        rejectEmailSub,
        rejectEmailBody,
      });

      console.log('Updated:', response.data);
      setShowModal(true);
      setSavedJob(data);
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
    const sessionID = data
    setShowModal(false);
    navigate('/recruiter/home/postjob/setemail', { state: { sessionID } });
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
          <input type="text" value={rejectEmailSub} className='krejemail-textbox' onChange={handleEmailSubjectChange}></input>
          <label><b>Email Body:</b></label>
          <textarea className='krejemail-textarea' value={rejectEmailBody} onChange={handleDefaultEmailChange}></textarea>
        </div>
        <div className='krejemail-buttons'>
          <button className='krejemail-save-btn' onClick={handleSave}>Save</button>
          <button className='krejemail-cancel-btn' onClick={() => navigate('/recruiter/home/postjob/setemail', { state: { savedJobId } })}>Cancel</button>
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
