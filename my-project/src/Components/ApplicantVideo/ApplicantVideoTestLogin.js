import React, { useState, useEffect } from 'react';
import img from './time2.svg';
import './ApplicantVideo.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


export default function ApplicantVideoTestLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [job, setJob] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { interviewid } = useParams();
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`http://localhost:8000/nabeeha/getjobdetailsforcvcollection`, { "jobID": interviewid })
      .then(res => {
        if (res.data.job) {
          setJob(res.data.job);
        } else {
          setErrorMessage(res.data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('An error occurred while fetching job details.');
      });

    if (errorMessage) {
      navigate('/error');
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword1 = () => {
    setShowPassword1((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateCredentials();

    
  };

  const validateCredentials = () => {
    const param = { jobID: job._id, email: email, password: password };
    axios.post("http://localhost:8000/nabeeha/checkapplicantcredentials", param)
      .then((response) => {
        setValid(response.data.status);
        if (response.data.status === "true"){
          
          
          sessionStorage.setItem("email",email);
          navigate('intropage', { state: { job }});
        }
        else
          setErrorMessage(response.data.message);
      })
      .catch(function (error) {
        
      });
  };

  return (
    <div className="post-job-container">
      <div className="content-container">
        <div className="nisa-image-container">
          <img src={img} alt="Your Image" />
        </div>
        <div className="nisa-form-container">
          <form onSubmit={handleSubmit}>
            <h4 className="nisa-video-head">Interview Portal</h4>
            <label className="nisa-video-input">
              Email:
              <input className="nisa-video-input" type="email" value={email} onChange={handleEmailChange} required />
            </label>
            <br />
            <label className="nisa-video-input">
              Password:
              <div className="password-input-container">
                <input
                  type={showPassword1 ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  class="nisa-video-input"
                  placeholder="Password"
                  required
                />
                <span className="password-toggle-login" onClick={toggleShowPassword1}>
                  {showPassword1 ? "Hide" : "Show"}
                </span>
              </div>
            </label>
            <br />
            <button className="nisa-video-button" type="submit">
              Login
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}