import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../RecruiterHome/postjob.css';
import img from './addrec.webp';

export default function AddRecruiter() {
  const navigate = useNavigate();

  const handlePostJob = () => {
    navigate('addrecruiter');
  };

  return (
    <div>
      <div className='nisa-postjob-con'>
        <img className='nisa-postjob-img' src={img} alt="Add a New Recruiter" />
        <h3 className='nisa-postjob-head'>Add a New Recruiter</h3>
        <button className='nisa-postjob-btn' onClick={handlePostJob}>
          Add Recruiter
        </button>
      </div>
    </div>
  );
}
