import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';
import img from './addrec.webp';

export default function AddRecruiter() {
  const navigate = useNavigate();

  const handlePostJob = () => {
    navigate('addrecruiter');
  };

  return (
    <div>
      <div className='k-postjob-con'>
        <img className='k-postjob-img' src={img} alt="Add a New Recruiter" />
        <h3 className='k-postjob-head'>Add a New Recruiter</h3>
        <button className='k-postjob-btn' onClick={handlePostJob}>
          Add Recruiter
        </button>
      </div>
    </div>
  );
}
