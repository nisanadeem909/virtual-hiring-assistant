import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from './signup.svg';
import Footer from './Footer';
import './login.css'; // Assuming you have styles from the login.css file

export default function Signup() {
  const [loggedIn, setLoggedIn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Add state for name
  const [designation, setDesignation] = useState(''); // Add state for designation
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Example: Validation logic
    if (!username || !email || !password || !name || !designation) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      
      const response = await axios.post('http://localhost:8000/nisa/signup', { username, email, password, name, designation });

      
      if (response.data.user) {
        // Set session ID in sessionStorage
        sessionStorage.setItem('sessionID', response.data.user.username);

        const sessionID = sessionStorage.getItem('sessionID');
        navigate("/recruiter/home/", { state: { sessionID } });
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      
      console.error(err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div>
      <div className='nisa-signup-container'>
        <div id="nab-wraplogin">
          <div className="nab-wrapper-login">
            <div className="nab-loginpage-right-side">
              <div className="nisa-login-right-innerbox">
                <div>
                  <h1 id="welcomeback">Sign Up</h1>
                  <h3 id="welcomeback-subheading">Create a new account to get started.</h3>
                  <form onSubmit={handleSignup}>
                    <div>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="nab-login-username" className="nab-form__input" placeholder="Username" />
                    </div>
                    <div>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" id="nab-login-name" className="nab-form__input" placeholder="Name" />
                    </div>
                    <div>
                      <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} name="designation" id="nab-login-designation" className="nab-form__input" placeholder="Designation" />
                    </div>
                    <div>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="nab-login-email" className="nab-form__input" placeholder="Email" />
                    </div>
                    <div>
                      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} name="password" id="nab-login-password" className="nab-form__input" placeholder="Password" />
                    </div>
                    <div>
                      <input type="submit" value="Sign Up" id="nab-login-submit-btn" />
                    </div>
                  </form>
                  {error && <p style={{ color: 'red', marginLeft: '200px' }}>{error}</p>}
                </div>
              </div>
            </div>
            <div className="nab-login-left-side">
              <img id="emerald" src={img} alt="emeraldimg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
