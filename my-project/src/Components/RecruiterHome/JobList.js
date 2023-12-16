import React, { useState, useEffect } from 'react';
import './JobList.css';
import jobicon from './jobicon.png';
import axios from 'axios';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:8000/nisa/alljobs') 
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

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
                <div className="job-status">Status: {job.status}</div>
              </div>
            </div>
            <button className="open-job-button">Open Job</button>
          </div>
        ))}
      </div>
    </div>
  );
}
