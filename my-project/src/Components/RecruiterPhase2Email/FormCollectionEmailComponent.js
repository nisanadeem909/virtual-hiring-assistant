import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FormCollectionEmailComponent() {
  const location = useLocation();
  const [job, setJob] = useState();
  const [formEmailBody, setEmail] = useState(
    "Congatulations! Your application for role at Manafa Technologies has successfull y passed Phase 1 of our recruitment.\n\nFor Phase 2, we require candidates to answer a few important questions about their role at our company. \n\nPlease find attached the link to the Form. Please submit it within the deadline specified. Good Luck! \n\n"
  );
  const [formEmailSub, setSubject] = useState("Regarding Your Application");
  const [formEmailDeadline, setDeadline] = useState("Form submission deadline date: ");
  const [savedjobId, setSavedJob] = useState();
  const [deadline, setDead] = useState();
  const [link, setLink] = useState();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [jobId,setJobID] = useState(null);

  useEffect(() => {
    //alert("hERE")
    if (location.state.job)
    {
      //alert(JSON.stringify(location.state.job))
      setJob(location.state.job);
      setDead(location.state.deadline);
      setLink(location.state.formLink);

    }
}, [location.state]);

  useEffect(() => {
    // const fetchJobDetails = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:8000/nisa/findjob/${jobId}`);
    //     setJob(response.data);
    //     //alert(job.P2FormDeadline);
    //     const dateObject = new Date(job?.P2FormDeadline);
    //     const formattedDate = dateObject.toLocaleDateString();
    //     setDead(formattedDate);
        
    //   } catch (error) {
    //     console.error('Error fetching job details:', error);
    //   }
    // };

    //   //alert(JSON.stringify(location.state))

    // if (jobId) {
    //   fetchJobDetails();
    // }
  }, [jobId]);

  const handleSave = async () => {
    // if (!jobId) {
    //   alert('Job ID not available');
    //   return;
    // }

    

    
 
    // Append the link to the end of the email body
    const updatedEmailBody = `${formEmailBody}\n\n${link}\n\n${formEmailDeadline}${deadline}`;
    //alert(updatedEmailBody)
    try {
      const response = await axios.post(`http://localhost:8000/nisa/api/emailForm/${job._id}`, {
        formEmailSub,
        formEmailBody: updatedEmailBody,
      });
  
      console.log('Updated:', response.data);
      setShowModal(true);
      setSavedJob(job._id);
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
    const jobID = job._id
    setShowModal(false);
    navigate('/recruiter/job', { state: { jobID } });
  };

  return (
    <div className='krejemail-container'>
      <div className='krejemail-header'>
        <label className='krejemail-header-title'>Set Phase 2: Form Screening Email </label>
        <hr></hr>
        <label className='krejemail-header-desc'>This will be the default email that will be sent to all candidates who passed Phase 1.</label>
      </div>
      <div className='krejemail-main'>
        <label><b>Job Title:</b> {job?.jobTitle}</label>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>Regarding Your Application for {job?.jobTitle} at company Manafa Technologies</label>
          <label><b>Form Link:</b></label>
          
          <div>
            <a href={link} target='_blank' rel='noopener noreferrer'>
              {link} 
            </a>
          </div>
          <div>
          <label style={{
                marginTop: '2vh'
              }}>
                    <b>Deadline:</b> {deadline}
                  </label>

          </div>
          <textarea className='nabrejemail-textarea' value={formEmailBody} onChange={handleDefaultEmailChange}></textarea>
        </div>
        <div className='krejemail-buttons'>
          <button className='krejemail-save-btn' onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      {showModal && (
        <div className='modal' style={{ display: 'block' }}>
          <p className='nisa-modal'>Email saved successfully!</p>
          <button className='nisa-modal-btn' onClick={handleModalClose}>Close</button>
        </div>
      )}
    </div>
  );
}
