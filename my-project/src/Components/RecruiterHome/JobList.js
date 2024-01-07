import React, { useState, useEffect } from 'react';
import './JobList.css';
import jobicon from './jobicon.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/nisa/alljobs') 
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const getPhaseLabel = (status) => {
    switch (status) {
      case 1:
        return 'Phase 1 - CV Screening';
      case 2:
        return 'Phase 2 - Form Screening';
      case 3:
        return 'Phase 3 - Video Interview';
      case 4:
        return 'Phase 4 - Technical Test';
      default:
        return 'Phase 0 - Hiring has not yet started!';
    }
  };

  return (
    <div>
      <div className='nisa-joblist-con'>
        <h2 className='nisa-joblists-head'>
          Jobs List
        </h2>
        {jobs.map((job, index) => (
          <div key={index} className="job-row">
            <div className="job-details">
              <div>
                <div className="job-title">{job.jobTitle}</div>
                <div className="job-status">
                  <span style={{ color: 'blue' }}>Status:</span> {getPhaseLabel(job.status)}
                </div>
              </div>
            </div>
            <button className="open-job-button" onClick={() => navigate('/recruiter/job', { state: { 'jobID': job._id } })}>Open Job</button>
          </div>
        ))}
      </div>
    </div>
  );
}
