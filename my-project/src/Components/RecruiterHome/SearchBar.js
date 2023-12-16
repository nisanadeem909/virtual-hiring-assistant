import React, { useState } from 'react';
import './SearchBar.css';
import searchIcon from './searchIcon2.png';
import axios from 'axios';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
   
    if (query.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:8000/nisa/api/jobs/search?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    } else {
      
      setSearchResults([]);
    }
  };
  

  const getMarginTop = () => {
    const resultCount = searchResults.length;
    if (resultCount === 0) {
      return '0';
    } else if (resultCount <= 2) {
      return `${resultCount * 55}px`; // Adjust the pixel value as needed
    } else {
      return '10%'; // Default margin when there are more than 2 results
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
      <button className="nisa-search-btn" >
        <img src={searchIcon} alt="Search" className="search-icon" />
      </button>

      
      {searchResults.length > 0 && (
        <ul className="search-results" style={{ marginTop: getMarginTop() }}>
          {searchResults.map((job, index) => (
            <li key={index} className="search-result-item" onClick={() => setSearchQuery(job)}>
             
              {job}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
