import React, { useState, useEffect } from 'react';
import '../RecruiterHome/JobList.css';
import './AdminHome.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const person = "personcircle.png"

export default function RecruiterList() {
  const [recruiters, setRecruiters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:8000/komal/getrecruiters') 
      .then(response => {
        if (response.data.status == "success"){
            setRecruiters(response.data.recs)
        }
        else
        alert('Error:', response.data.error)
    }).catch(error => alert('Axios Error:', error));
  }, []);

  return (
    <div>
      <div className='nisa-joblist-con'>
        <h2 className='nisa-joblists-head'>
          Recruiter List
        </h2>
        {recruiters.map((rec, index) => (
          <div key={index} className="job-row">
            <div className="job-details">
              <div className='k-recdiv' >
                <img className='k-rec-profilepic' src={`http://localhost:8000/routes/profilepictures/${rec.profilePic || person}`}></img>
                <div>
                <div className="job-title">{rec.name}</div>
                <div className="job-status">
                  {rec.email}
                </div>
                </div>
              </div>
            </div>
            <button className="open-job-button">Remove Recruiter</button>
          </div>
        ))}
      </div>
    </div>
  );
}
