import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostJobPage.css';
import img from './postjob2.svg';
import img2 from './done2.gif';
import axios from 'axios';

export default function PostJobPage() {
  const [phase, setPhase] = useState(0);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    applicantsSelected: '',
    phase1Deadline: '',
    phase1Percentage: '',
  });

  const [validationError, setValidationError] = useState('');
  const [showDoneImage, setShowDoneImage] = useState(false);
  const [jobId, setJobId] = useState();
  const [automate, setAutomate] = useState();
  const [jobpost, setJobPost] = useState();
  const navigate = useNavigate(); // Hook for navigation
  const [rejectEmailBody, setEmail] = useState("\n\nThank you for your interest in this role. We appreciate the time and effort you invested in your application. \n\nAfter careful consideration, we regret to inform you that we have chosen another candidate for this position as the competition was high. \n\nWe will keep your resume for future opportunities that match your skills.");
  const [rejectEmailSub, setSubject] = useState("Regarding Your Application for (role) at (company name)");
  const sessionID = sessionStorage.getItem('sessionID');
      

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

  const handleNext = () => {
   
    if (phase === 0) {
      // Validate required fields for Phase 0
      if (!formData.jobTitle || !formData.jobDescription || !formData.jobTitle.trim() || !formData.jobDescription.trim()) {
        setValidationError('Please fill in all required fields.');
        return;
      }
    } else if (phase === 1) {
      // Validate required fields for Phase 1
      if (!formData.phase1Deadline || !formData.phase1Percentage) {
        setValidationError('Please fill in all required fields for Phase 1.');
        return;
      }
    } else if (phase === 2) {
      // Validate required fields for Phase 2
      if (automate === undefined) {
        setValidationError('Please select Fully Automated or Automated.');
        return;
      }
    } else if (phase === 3) {
      // Validate required fields for Phase 3
     
      if (jobpost === undefined) {
        setValidationError('Please select Post Job or Hold Job.');
        return;
      }
    }
  
    setValidationError('');
    setPhase(phase + 1);
  };

  const handleBack = () => {
    if (phase > 0) {
      setPhase(phase - 1);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

 
  const handleAnotherPhase = (j) => {
    
    var jobID = j._id
   
    navigate('/recruiter/job', { state: { jobID } });
  };

  const handleAutomated = () => {
  
   setAutomate(1);
   
  };

  const handleManual = () => {
  
    setAutomate(0);
  };

  const handlePost = () => {
  
    setJobPost(1);
    
   };
 
   const handleHold = () => {
   
     setJobPost(0);
   };

   const handleDefaultEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!rejectEmailBody || !rejectEmailBody.trim())
      {
        setValidationError('Please enter the rejection email body.');
       
        return;
      }
      // Validate required fields for Phase 2
      if (!formData.phase1Deadline || !formData.phase1Percentage) {
        setValidationError('Please fill in all required fields for Phase 1.');
        return;
      }

      // Additional validation for Phase 2 submission
      if (!formData.phase1Percentage) {
        setValidationError('Please fill in the percentage for Phase 1.');
        return;
      }

      if (jobpost === undefined) {
        setValidationError('Please select Post Job or Hold Job.');
        return;
      }

      const percentage = parseInt(formData.phase1Percentage);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        setValidationError('Please enter a valid percentage for Phase 1.');
        return;
      }

        const currentDate = new Date().toISOString(); 
        const selectedDeadline = new Date(formData.phase1Deadline).toISOString();
        if (selectedDeadline <= currentDate) {
          setValidationError('Deadline must not be a past date.');
            return;
        }

      

      const response = await axios.post('http://localhost:8000/nisa/api/saveFormData', {
        sessionID,
        phase,
        automate, 
        jobpost, 
        ...formData,
      });
      const savedJobId = response.data._id; // Assuming "_id" is the field representing the job ID
      const j = response.data;
     
      if (savedJobId) {
        setJobId(savedJobId);
        try {
          var id = savedJobId;
          const response = await axios.post(`http://localhost:8000/nisa/api/updateEmailsAndForm/${id}`, {
            rejectEmailBody,
          });
    
          console.log('Updated:', response.data);
          
        } catch (error) {
          console.error('Error updating emails and form:', error);
          setValidationError('Something went wrong, please try again..');
        }

       
      } else {
        console.error('Job ID is undefined in the response:', response.data);
        // Handle the error as needed
      }

     
      setShowDoneImage(true);
      setTimeout(() => {
        setShowDoneImage(false);
        handleAnotherPhase(j);
      }, 2000); 
      
    } catch (error) {
      //alert(error.response.data);
      setValidationError('Error while saving data. Please try again.');
    }
  };

  return (
    <div className="post-job-container">
      <div className="content-container">
        <div className="left-content">
          {showDoneImage ? (
            <div>
              <img className="nisa-post-img2" src={img2} alt="Done" />
            </div>
          ) : (
            <div>
              <h1>Job Details</h1>

              {phase === 0 && (
                <div className="job-details">
                  <label className="nisa-pj-label" htmlFor="jobTitle">
                    Job Title<span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input className="nisa-pj-input" type="text" id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />

                  <label className="nisa-pj-label" htmlFor="jobDescription">
                    Job Description<span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                  </label>
                  <textarea
                    className="nisa-pj-textarea"
                    id="jobDescription"
                    rows="4"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                  ></textarea>

                  {validationError && <p style={{ color: 'red' }}>{validationError}</p>}

                  <button className="nisa-postJ-button" onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}

              {phase === 1 && (
                <div className="phase-details">
                  <h1 className="nisa-phase1">Phase {phase} - CV Screening</h1>
                  <label className="nisa-pj-label" htmlFor="phase1Deadline">
                    Phase 1 Deadline<span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input
                    className="nisa-pj-input"
                    type="datetime-local"
                    id="phase1Deadline"
                    value={formData.phase1Deadline}
                    onChange={handleInputChange}
                    min={getCurrentDate()}
                  />

                  <label className="nisa-pj-label" htmlFor="phase1Percentage">
                    Acceptable CV to JD Match Percentage.{' '}
                    <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                    <span style={{ color: 'red', marginLeft: '120px' }}>Recommended: 60 - 70%</span>
                  </label>

                  <input
                    className="nisa-pj-input"
                    type="number"
                    id="phase1Percentage"
                    value={formData.phase1Percentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />

                  {validationError && <p style={{ color: 'red' }}>{validationError}</p>}

                  <button className="nisa-postJ2-button" onClick={handleBack}>
                    Back
                  </button>
                  <button className="nisa-postJ2-button" onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}

              {phase === 2 && (
                <div className="phase-details">
                <h1 className="nisa-phase1">Automated or Manual</h1>
                {/* ... (Phase 2 content) */}
               
                {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
                
               
                <div className="options-container">
                  <label className='nisa-j-l'>
                    <input
                      type="radio"
                      className="nisa-option-checkbox"
                      name="recruitmentOption"
                      onChange={handleAutomated}
                      checked={automate === 1}
                    />
                    Fully Automated
                  </label>
                  <p className='nisa-s'>This will ensure that the job process proceeds automatically from one phase to the next</p>

                  <hr className="nisa-horizontal-line" />
                  
                  <label className='nisa-j-l'>
                    <input
                      type="radio"
                      className="nisa-option-checkbox"
                      name="recruitmentOption"
                      onChange={handleManual}
                      checked={automate === 0}
                    />
                    Automated
                  </label>
                  <p>This will require recruiters confirmation to proceed from one phase to the next</p>
                </div>

                
               
                <button className="nisa-postJ2-button" onClick={handleBack}>
                  Back
                </button>
                <button className="nisa-postJ2-button" onClick={handleNext}>
                  Next
                </button>
              </div>
              
              
              )}

{phase === 3 && (
              <div className="phase-details">
                <h1 className="nisa-phase1">Post Job or Hold Job</h1>
                {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
                 <div className="options-container">
                  <label className='nisa-j-l'>
                    <input
                      type="radio"
                      className="nisa-option-checkbox"
                      name="recruitmentOption"
                      onChange={handlePost}
                      checked={jobpost === 1}
                    />
                    Post Job
                  </label>
                  <p className='nisa-s'>This will post the job and generate the CV collection link</p>

                  <hr className="nisa-horizontal-line" />
                  
                  <label className='nisa-j-l'>
                    <input
                      type="radio"
                      className="nisa-option-checkbox"
                      name="recruitmentOption"
                      onChange={handleHold}
                      checked={jobpost === 0}
                    />
                    Hold Job
                  </label>
                  <p>This will not post the job and will be on hold.</p>
                </div>

              
                <button className="nisa-postJ2-button" onClick={handleBack}>
                  Back
                </button>
                <button className="nisa-postJ2-button" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}

{phase === 4 && (
  <div className="phase-details">
    <h1 className="nisa-phase1">Set Rejection Email</h1>

    <label className="nisa-pj-label" htmlFor="emailSubject">
      Email Subject:
    </label>
    <input
      className="nisa-pj-input"
      type="text"
      id="emailSubject"
      value={rejectEmailSub}
      readOnly
    />

    <label className="nisa-pj-label" htmlFor="emailBody">
      Email Body
    </label>
    <textarea
      className="nisa-pj-textarea"
      id="emailBody"
      rows="8"
      placeholder="Write your rejection email here..."
      value={rejectEmailBody}
      onChange={handleDefaultEmailChange}
    ></textarea>

    {validationError && <p style={{ color: 'red' }}>{validationError}</p>}

    <button className="nisa-postJ2-button" onClick={handleBack}>
      Back
    </button>
    <button className="nisa-postJ2-button" onClick={handleSubmit}>
      Submit
    </button>
  </div>
)}


              
            </div>
          )}
        </div>

        <div className="right-content">
          <img className="nisa-post-img" src={img} alt="Your Image" />
        </div>
      </div>
      
    </div>
  );
}
