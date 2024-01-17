import React, { useState } from 'react';
import img from './time2.svg'
import './ApplicantVideo.css'
export default function ApplicantVideoTestLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);

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
    
    setEmail('');
    setPassword('');
  };

  return (
    <div className="post-job-container">
      <div className="content-container">
        <div className="nisa-image-container">
         
          <img src={img} alt="Your Image" />
        </div>
        <div className="nisa-form-container">
          <form onSubmit={handleSubmit}>
            <h4 className='nisa-video-head'>Interview Portal</h4>
            <label className='nisa-video-input' >
              Email:
              <input  className='nisa-video-input'  type="email" value={email} onChange={handleEmailChange} required />
            </label>
            <br />
            <label  className='nisa-video-input' >
              Password:
              <div className="password-input-container">    
                  <input type={showPassword1 ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} name="password" class="nisa-video-input" placeholder="Password" />
                  <span className="password-toggle-login" onClick={toggleShowPassword1}>
                {showPassword1 ? "Hide" : "Show"}
              </span>
              </div>
            </label>
            <br />
            <button  className='nisa-video-button'  type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
