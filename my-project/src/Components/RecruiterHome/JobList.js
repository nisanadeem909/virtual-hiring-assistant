import React from 'react';
import './JobList.css';
import jobicon from './jobicon.png';

export default function JobList() {
  // Sample job data
  const jobData = [
    { title: 'Software Engineer', stats: 10 },
    { title: 'Data Analyst', stats: 5 },
    { title: 'UI/UX Designer', stats: 8 },
    // Add more job data as needed
  ];

  return (
    <div>
      <div className='nisa-joblist-con'>
     
        <h2 className='nisa-joblists-head'>
          Jobs List
        </h2>
        {jobData.map((job, index) => (
          <div key={index} className="job-row">
            <div className="job-details">
              <div>
                <div className="job-title">{job.title}</div>
                <div className="job-status">Status: {job.stats}</div>
              </div>
            </div>
            <button className="open-job-button">Open Job</button>
          </div>
        ))}
      </div>
    </div>
  );
}
