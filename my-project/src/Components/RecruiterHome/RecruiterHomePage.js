import React from 'react';
import './RecruiterHomePage.css';
import RecruiterProjile from './RecruiterProjile';
import Postjob from './postjob';
import SearchBar from './SearchBar';
import JobList from './JobList';
import Footer from '../Footer';


export default function RecruiterHomePage() {
  return (
    <div className="grid-container">
      <div className="profile-box"> {/* Left column */}
        <RecruiterProjile></RecruiterProjile>
      </div>

      <div className="post-job"> {/* Left column */}
        <Postjob></Postjob>
      </div>

      <div className="search-bar"> {/* Middle column */}
        <SearchBar></SearchBar>
      </div>

      <div className="job-list"> {/* Right column */}
        <JobList></JobList>
      </div>

      <div className="uh_footer">
                <Footer/>
            </div>
    </div>
  );
}
