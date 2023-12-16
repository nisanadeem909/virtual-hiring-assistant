import React, { useState, useEffect } from 'react';
import './RecruiterHomePage.css';
import RecruiterProjile from './RecruiterProjile';
import Postjob from './postjob';
import SearchBar from './SearchBar';
import JobList from './JobList';
import Footer from '../Footer';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function RecruiterHomePage() {
  const [recruiterData, setRecruiterData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    
    if (location && location.state && location.state.sessionID) {
      const sessionID = location.state.sessionID;

      axios.get(`http://localhost:8000/nisa/recruiter/${sessionID}`)
        .then(res => {
          const data = res.data;
          setRecruiterData(data);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      console.error("SessionID not found");
    }
  }, [location]);

  return (
    <div className="grid-container">
      <div className="profile-box">
        {recruiterData && <RecruiterProjile data={recruiterData}></RecruiterProjile>}
      </div>

      <div className="post-job"> 
        <Postjob></Postjob>
      </div>

      <div className="search-bar"> 
        <SearchBar></SearchBar>
      </div>

      <div className="job-list"> 
        <JobList></JobList>
      </div>

      <div className="uh_footer">
        <Footer />
      </div>
    </div>
  );
}
