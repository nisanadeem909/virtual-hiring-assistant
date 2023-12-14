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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Example: Validation logic
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Example: Call your API to register the user
    axios.post('http://localhost:8000/signup', { username, email, password })
      .then(res => {
        // Handle success
        setLoggedIn('user'); // or 'company' based on the response
      })
      .catch(err => {
        // Handle error
        console.error(err);
        setError("Signup failed. Please try again."); 
      });
  };

  return (
    <div>
      <div className='nisa-signup-container'>
        <div id="nab-wraplogin">
          <div className="nab-wrapper-login">
            <div className="nab-loginpage-right-side">
              <div className="nab-login-right-innerbox">
                <div>
                  <h1 id="welcomeback">Sign Up</h1>
                  <h3 id="welcomeback-subheading">Create a new account to get started.</h3>
                  <form onSubmit={handleSignup}>
                    <div>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="nab-login-username" className="nab-form__input" placeholder="Username" />
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
                  {error && <p style={{ color: 'red', marginLeft: '150px' }}>{error}</p>}
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
