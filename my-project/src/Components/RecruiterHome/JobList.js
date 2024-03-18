import React, { useState, useEffect } from 'react';
import './JobList.css';
import jobicon from './jobicon.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import filtericon from './filtericon.png'
import load from './loading.gif'

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const calculateDeadlineForPhase3or4 = (P3StartDate, P3Days) => {
    if (P3StartDate && P3Days) {
      const deadlineDate = new Date(P3StartDate);
      deadlineDate.setDate(deadlineDate.getDate() + P3Days);
      return formatDate(deadlineDate); // Use your date formatting function here
    } else {
      return 'Deadline not set';
    }
  };
  

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

  const setDefaultJobs = ()=>{
    setLoading(true);
    var username = sessionStorage.getItem('sessionID');
    axios.get(`http://localhost:8000/nisa/alljobs/${username}`)
    .then(response => {
      setJobs(response.data);
      setLoading(false); // Set loading state to false after receiving the response
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
      setLoading(false); // Ensure loading state is set to false in case of an error
    });
  } 
  useEffect(() => {
    setDefaultJobs();
  }, []);

  const getPhaseLabel = (status,postjob) => {
    switch (status) {
      case 1:
        if(postjob)
        return 'Phase 1 - CV Screening';
        else
        return 'On Hold';
      case 2:
        return 'Phase 2 - Form Screening';
        case 3:
          case 4:
            return 'Phase 3/4 - Video and Technical Test';
      default:
        return 'Phase 0 - Hiring has not yet started!';
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredJobs,setFilteredJobs] = useState([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const setUpdatedJobs = (selectedFilters)=>{
    
    // alert("in set updated jobs")
    //alert(selectedFilters)
    const username = sessionStorage.getItem('sessionID');
    axios.post('http://localhost:8000/nisa/filterjobsnabeeha', { selectedFilters, username})
      .then(res => {
        setFilteredJobs(res.data)
        //alert(JSON.stringify(filteredJobs))
        setJobs(res.data)
        
      })
      .catch(err => {
        //alert("error" + err)
      })
  }
  const handleFilterSelection = (filter) => {
   
    
    if (filter === 'Clear All') {
      clearAllFilters();
      setDefaultJobs();
    } 
    else {
      const updatedFilters = [...selectedFilters];
      // Toggle the filter: add if not present, remove if present
      if (updatedFilters.includes(filter)) {
        updatedFilters.splice(updatedFilters.indexOf(filter), 1);
        
        
      } 
      else {
        updatedFilters.push(filter);
        
      }

      
      
      setUpdatedJobs(updatedFilters)
      setSelectedFilters(updatedFilters)
    }

    
   
  };
  
  const clearAllFilters = () => {
    setSelectedFilters([]);
    
  };
  const filters = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4','Clear All'];
  return (
    <div>
      <div className='nisa-joblist-con'>
        <h2 className='nisa-joblists-head'>
          Jobs List
        </h2>
        <div id="nab-filter-jobs">
            <button id="nab-filter-button" onClick={toggleDropdown}>
                <img id="nab-filter-icon" src={filtericon} alt="Filter Icon" />
                Filter Jobs
            </button>
            
            {isDropdownOpen && (
            <ul className="filter-dropdown">
              {filters.map((filter, index) => (
                <li id="nab-filter-li" key={index} onClick={() => handleFilterSelection(filter)}>
                  <input
                    id="nab-filter-checkbox"
                    type="checkbox"
                    checked={selectedFilters.includes(filter)}
                    readOnly
                  />
                  {filter}
                </li>
              ))}
            </ul>
          )}
          
        </div>
        {loading && (
          <div className='loading-container'>
            <img className='nisa-load' src={load} alt='Loading...' />
          </div>
        )}
          {/* Render jobs list when not loading */}
     {/* Render jobs list when not loading */}
{!loading && (
  jobs.length === 0 ? (
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
              <span className="nisa-value">{getPhaseLabel(job.status,job.postjob)}</span>
            </div>
            <div className='nisa-job-dead'>
              <span className="nisa-label2">Deadline:</span>
              <span className='nisa-value'>
                      {job.status === 1
                        ? formatDate(job.CVDeadline)
                        : job.status === 2
                        ? job.P2FormDeadline
                          ? formatDate(job.P2FormDeadline)
                          : 'Deadline not set'
                        : calculateDeadlineForPhase3or4(job.P3StartDate, job.P3Days)}
                    </span>
            </div>
          </div>
        </div>
      </div>
    ))
  )
)}

      </div>
    </div>
  );
}