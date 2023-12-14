import React from 'react';
import './SearchBar.css';
import searchIcon from './searchIcon2.png'; 

export default function SearchBar() {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
      />
      <button className="nisa-search-btn">
        <img src={searchIcon} alt="Search" className="search-icon" />
      </button>
    </div>
  );
}
