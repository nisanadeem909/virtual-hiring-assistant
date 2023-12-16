import React, { useEffect, useState } from 'react';
import './RecruiterProfile.css';
import img from './personcircle.png';

const RecruiterProfile = ({ data }) => {
  const handleEditProfile = () => {
    
    console.log('Edit Profile clicked');
  };

  const [person,setPerson] = useState(null);

  useEffect(()=>{
   // alert(JSON.stringify(data))
      if (data)
      {
        setPerson(data.profilePic);
      }
  },[data])

  var person2 = 'personcircle.png';
  
  return (
    <div>
      <div className='nisa-profile-container'>
        <img className='niss-profilepic' src={`http://localhost:8000/profilepictures/${person || person2}`} alt="Profile Pic" />
        <h3>{data.name}</h3>
        <h4 className='nisa-head'>@{data.username}</h4>
        <h4 className='nisa-head2'>{data.designation}</h4>
        <button className='edit-profile-btn' onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default RecruiterProfile;
