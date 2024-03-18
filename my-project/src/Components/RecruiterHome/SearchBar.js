import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import searchIcon from './searchIcon2.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = async (e) => {

    console.log('Handling input change');

    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== '') {
      try {

        const sessionID = sessionStorage.getItem('sessionID');
        //alert("sessionID= " + sessionID);
        const response = await axios.get(`http://localhost:8000/nisa/api/jobs/search?q=${query}&sessionID=${sessionID}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (job) => {
  
    var jobID = job._id; 
   
    navigate("/recruiter/job", { state: { jobID } });

  };

  useEffect(() => {
    // Attach event listeners here

    return () => {
      // Detach event listeners if necessary
    };
  }, [searchResults]); // Only run the effect when searchResults change

  const getMarginTop = () => {
    const resultCount = searchResults.length;
    const maxResultsHeight = 300; // Adjust the maximum height as needed
    const minMargin = 50; // Adjust the minimum margin as needed

    if (resultCount === 0) {
      return '0';
    } else {
      const calculatedHeight = Math.min(resultCount * 50, maxResultsHeight);
      return `${Math.max(calculatedHeight, minMargin)}px`;
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchQuery}
        onChange={handleInputChange}
        onBlur={() => setSearchResults([])} 
      />
     

      {searchResults.length > 0 && (
        <ul className="search-results" style={{ marginTop: getMarginTop() }}>
          {searchResults.map((job, index) => (
            <li
              key={index}
              className="search-result-item"
              onMouseDown={() => handleSearchResultClick(job)}
            >
              {job.jobTitle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
