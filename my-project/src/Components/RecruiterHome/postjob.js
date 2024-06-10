import React from 'react';
import { useNavigate } from 'react-router-dom';
import './postjob.css';
import img from './postjob2.png';
import PostJobPage from '../PostJob/PostJobPage';

export default function PostJob() {
  const navigate = useNavigate();

  const handlePostJob = () => {
    // You can perform any necessary logic before navigating
    // For now, simply navigate to the post job page
    navigate('postjob');
  };

  return (
    <div>
      <div className='nisa-postjob-con'>
        <img className='nisa-postjob-img' src={img} alt="Post a New Job" />
        <h3 className='nisa-postjob-head'>Post a New Job</h3>
        <button className='nisa-postjob-btn' onClick={handlePostJob}>
          Post Job
        </button>
      </div>
    </div>
  );
}
