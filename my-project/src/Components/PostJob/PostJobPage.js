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
  const navigate = useNavigate(); // Hook for navigation

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
    }

    if (phase < 2) {
      setValidationError('');
      setPhase(phase + 1);
    }
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
  
    navigate('rejectionemail', { state: { j } });
  };

  const handleSubmit = async () => {
    try {
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
        ...formData,
      });
      const savedJobId = response.data._id; // Assuming "_id" is the field representing the job ID
      const j = response.data;
      // Check if the savedJobId is not undefined
      if (savedJobId) {
        setJobId(savedJobId);
       
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
      alert(error.response.data);
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
                  <label className='nisa-pj-label' htmlFor="jobTitle">Job Title<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                  <input
                   className='nisa-pj-input'
                    type="text"
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                  />

                  <label className='nisa-pj-label' htmlFor="jobDescription">Job Description<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                  <textarea
                  className='nisa-pj-textarea'
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
                  <label className='nisa-pj-label' htmlFor="phase1Deadline">
                  Phase 1 Deadline<span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                </label>
                <input
                  className='nisa-pj-input'
                  type="datetime-local"
                  id="phase1Deadline"
                  value={formData.phase1Deadline}
                  onChange={handleInputChange}
                  min={getCurrentDate()} 
                />

                  <label className='nisa-pj-label' htmlFor="phase1Percentage">
                    Acceptable CV to JD Match Percentage.{' '}<span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                    <span style={{ color: 'red', marginLeft: '120px' }}>Recommended: 60 - 70%</span>
                  </label>

                  <input
                   className='nisa-pj-input'
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
                  {phase === 1 && (
                    <button className="nisa-postJ2-button" onClick={handleSubmit}>
                      Submit
                    </button>
                  )}
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
