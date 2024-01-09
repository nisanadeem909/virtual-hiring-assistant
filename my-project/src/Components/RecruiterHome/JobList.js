import React, { useState, useEffect } from 'react';
import './JobList.css';
import jobicon from './jobicon.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${formattedDate.getDate()}`.padStart(2, '0');
    let hours = formattedDate.getHours();
    const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    return `${day}-${month}-${year} ${hours}:${minutes} ${amOrPm}`;
  };

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
        {jobs.length === 0 ? (
          <div className='kjob-nojob'>No jobs found</div>
        ) : (
          jobs.map((job, index) => (
            <div
              key={index}
              className="job-row"
              onClick={() => navigate('/recruiter/job', { state: { 'jobID': job._id } })}
            >
              <div className="job-details">
                <div className="job-title">{job.jobTitle}</div>
                <div className="job-status-deadline">
                  <div>
                    <span className="nisa-label1">Status:</span>
                    <span className="nisa-value">{getPhaseLabel(job.status)}</span>
                  </div>
                  <div className='nisa-job-dead'>
                    <span className="nisa-label2">Deadline:</span>
                    <span className="nisa-value">
                      {job.status === 1 ? formatDate(job.CVDeadline) :
                        job.status === 2 ? (job.P2FormDeadline ? formatDate(job.P2FormDeadline) : 'Deadline not set') :
                          'Deadline not set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}