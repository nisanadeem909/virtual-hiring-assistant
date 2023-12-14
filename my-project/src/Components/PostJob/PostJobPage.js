import React, { useState } from 'react';
import './PostJobPage.css';
import img from './postjob2.svg';

export default function PostJobPage() {
  const [phase, setPhase] = useState(0);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobDeadline: '',
    applicantsSelected: '',
    phase1Deadline: '',
    phase1Percentage: '',
    phase2Deadline: '',
    phase2Percentage: '',
    phase3Deadline: '',
    phase3Percentage: '',
    phase4Deadline: '',
    phase4Percentage: '',
  });

  const handleNext = () => {
    if (phase < 5) {
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

  return (
    <div className="post-job-container">
      <div className="content-container">
        <div className="left-content">
          <h1>Job Details</h1>
          {phase === 0 && (
            <div className="job-details">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
              />

              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                rows="4"
                value={formData.jobDescription}
                onChange={handleInputChange}
              ></textarea>

              <label htmlFor="jobDeadline">Job Deadline</label>
              <input
                type="date"
                id="jobDeadline"
                value={formData.jobDeadline}
                onChange={handleInputChange}
              />

              <label htmlFor="applicantsSelected">No of Applicants Selected</label>
              <input
                type="number"
                id="applicantsSelected"
                value={formData.applicantsSelected}
                onChange={handleInputChange}
              />

              <button onClick={handleNext}>Next</button>
            </div>
          )}

          {/* ... (similar changes for other phases) */}

          {phase === 1 && (
            <div className="phase-details">
              <h1 className="nisa-phase1">Phase {phase} - CV Screening</h1>
              <label htmlFor="phase1Deadline">Phase 1 Deadline</label>
              <input
                type="date"
                id="phase1Deadline"
                value={formData.phase1Deadline}
                onChange={handleInputChange}
              />

              <label htmlFor="phase1Percentage">
                Percentage of Applicants to Select for Phase 1
              </label>
              <input
                type="number"
                id="phase1Percentage"
                value={formData.phase1Percentage}
                onChange={handleInputChange}
              />

              <button onClick={handleBack}>Back</button>
              {phase < 4 && <button onClick={handleNext}>Next</button>}
            </div>
          )}

          {/* ... (similar changes for other phases) */}

          {phase === 4 && (
            <div className="phase-details">
              <h1 className="nisa-phase4">Phase {phase} - Video Interview</h1>
              <label htmlFor="phase4Deadline">Phase 4 Deadline</label>
              <input
                type="date"
                id="phase4Deadline"
                value={formData.phase4Deadline}
                onChange={handleInputChange}
              />

              <label htmlFor="phase4Percentage">
                Percentage of Applicants to Select for Phase 4
              </label>
              <input
                type="number"
                id="phase4Percentage"
                value={formData.phase4Percentage}
                onChange={handleInputChange}
              />

              <button onClick={handleBack}>Back</button>
              {phase < 4 && <button onClick={handleNext}>Next</button>}
              {phase === 4 && (
                <button onClick={() => alert('Submit logic here')}>Submit</button>
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
