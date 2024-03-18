import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RejectionEmail.css';
import axios from 'axios';
import { useEffect } from 'react';

export default function RejectionEmailPage({ data }) {
  const [jobTitle, setJobTitle] = useState();
  const [company, setCompany] = useState("Manafa Technologies");
 const [rejectEmailSub, setSubject] = useState("Regarding Your Application for " + jobTitle + " at " + company);
  const [showModal, setShowModal] = useState(false);
  const [savedJobId, setSavedJob] = useState("Manafa Technologies");
  const [job, setJob] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [rejectEmailBodyError, setRejectEmailBodyError] = useState('');

  useEffect(() => {
    // Use optional chaining to avoid errors if location or location.state is undefined
    const jobData = location.state?.j || [];
    setJob(jobData);
   
    setJobTitle(jobData.jobTitle)
  }, [location.state]); // Run the effect when location.state changes
  const [rejectEmailBody, setEmail] = useState("\n\nThank you for your interest in the role at " + company + ". We appreciate the time and effort you invested in your application. \n\nAfter careful consideration, we regret to inform you that we have chosen another candidate for this position as the competition was high. \n\nWe will keep your resume for future opportunities that match your skills.");
  

  const handleSave = async () => {
    //alert('savingngn')
    if (!rejectEmailBody || !rejectEmailBody.trim())
    {
      setRejectEmailBodyError('Please enter the rejection email body.');
      //alert("here")
      return;
    }

    try {
      var id = job._id;
      const response = await axios.post(`http://localhost:8000/nisa/api/updateEmailsAndForm/${id}`, {
        rejectEmailBody,
      });

      console.log('Updated:', response.data);
      setRejectEmailBodyError('');
      setShowModal(true);
      setSavedJob(data);
    } catch (error) {
      console.error('Error updating emails and form:', error);
      setRejectEmailBodyError('Something went wrong, please try again..');
    }
  };

  const handleEmailSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleDefaultEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleModalClose = () => {
    const jobID = job._id
    setShowModal(false);
    navigate('/recruiter/job', { state: { jobID } });
  };

  return (
    <div className='krejemail-container'>
      <div className='krejemail-header'>
        <label className='krejemail-header-title'>Set Rejection Email</label>
        <hr></hr>
        <label className='krejemail-header-desc'>This will be the default email that will be sent to all rejected candidates in each phase.</label>
      </div>
      <div className='krejemail-main'>
        <label><b>Job:</b> {job.jobTitle}</label>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>Regarding Your Application for {job.jobTitle} at {company}</label>
          <br></br>
          <label><b>Email Body:</b></label>
          <textarea className='krejemail-textarea' value={rejectEmailBody} onChange={handleDefaultEmailChange}></textarea>
        {rejectEmailBodyError && <div className='krej-emailerror'>{rejectEmailBodyError}</div>}
      </div>
        <div className='krejemail-buttons'>
          <button className='krejemail-save-btn' onClick={handleSave}>Save</button>
          
        </div>
        
      </div>
      {showModal && (
        <div className='modal' style={{ display: 'block' }}>
          <p className='nisa-modal'>Email saved successfully!</p>
          <button className='nisa-modal-btn' onClick={handleModalClose}>Close</button>
        </div>
      )}
    </div>
  )
}
