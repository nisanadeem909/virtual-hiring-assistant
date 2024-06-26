import React, { useEffect, useState } from 'react';
import './RecruiterProfile.css';
import img from './personcircle.png';
import { useNavigate } from 'react-router-dom';

const RecruiterProfile = ({ data }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    const sessionID = sessionStorage.getItem('sessionID');
    console.log('Edit Profile clicked');
    if (sessionID) {
      navigate("/recruiter/profile", { state: { sessionID } });
    } else {
      console.error("SessionID not found");
    }

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
        <img className='niss-profilepic' src={`http://localhost:8000/routes/profilepictures/${person || person2}`} alt="Profile Pic" />
        <h4 className='nisa-head'>@{data.username}</h4>
        <h3 className='nisa-head'>{data.name}</h3>
        <h4 className='nisa-head2'>{data.designation}</h4>
        <h4 className='nisa-head3'>{data.companyname}</h4>
        <button className='edit-profile-btn' onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default RecruiterProfile;
