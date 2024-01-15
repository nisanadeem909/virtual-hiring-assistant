import React, { useState } from 'react';
import './login.css';
import img from './LoginFinal.svg';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [loggedIn, setLoggedIn] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const navigate = useNavigate();

  const viewRecruiter = () => {
    const sessionID = sessionStorage.getItem('sessionID');

    if (sessionID) {
      navigate("/recruiter/home", { state: { sessionID } });
    } else {
      console.error("SessionID not found");
    }
    
  }

  const toggleShowPassword1 = () => {
    setShowPassword1((prevShowPassword) => !prevShowPassword);
  };

  const viewCompany = () => {
    const sessionID = sessionStorage.getItem('sessionID');

    if (sessionID) {
      navigate("/company", { state: { sessionID } });
    } else {
      console.error("SessionID not found");
    }
    
  }
  const viewSuperAdmin = () => {
    const sessionID = sessionStorage.getItem('sessionID');

    if (sessionID) {
      navigate("/admin", { state: { sessionID } });
    } else {
      console.error("SessionID not found");
    }
    
  }

  

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!username || !password)
    {
      setError("Please enter both fields!")
      return;
    }

    axios.post('http://localhost:8000/nisa/loginrecruiter', { username, password })
      .then(res => {
        const sessionID = res.data.sessionId;
        sessionStorage.setItem('sessionID', sessionID);
        sessionStorage.setItem('type', 'recruiter');
        setError(null); 
        viewRecruiter();

      })
      .catch(err => {
        console.log(err);
        //setError("Login failed. Please check your credentials."); 
        axios.post('http://localhost:8000/nisa/loginadmin', { username, password })
        .then(res => {
          const sessionID = res.data.sessionId;
          sessionStorage.setItem('sessionID', sessionID);
          sessionStorage.setItem('type', 'admin');
          setError(null); 
          //alert("hello?")
          viewSuperAdmin();

        })
        .catch(err => {
          console.log(err);
          //setError("Login failed. Please check your credentials."); 
          axios.post('http://localhost:8000/nisa/logincompany', { username, password })
          .then(res => {
            const sessionID = res.data.sessionId;
            sessionStorage.setItem('sessionID', sessionID);
            sessionStorage.setItem('type', 'company');
            setError(null); 
            viewCompany();

          })
          .catch(err => {
            console.log(err);
            setError("Login failed. Please check your credentials."); 
          });
        });
      });
      
  };


  return (
    <div id="nab-wraplogin">
      <div class="nab-wrapper-login">

        <div class="nab-login-left-side">
          <img id="emerald" src={img} alt="emeraldimg" />
        </div>

        <div class="nab-loginpage-right-side">
          <div class="nab-login-right-innerbox">

            <div>
              <h1 id="welcomeback">Welcome Back</h1>
              <h3 id="welcomeback-subheading">Login to get started right where you left off.</h3>
              <form className='nisa-sign-con' onSubmit={handleLogin}>
                <div>
                <label htmlFor="nab-login-username" className="nab-form__label2">
                        <b>Username<span style={{ color: 'red' }}>*</span></b>
                </label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="nab-login-username2" class="nab-form__input" placeholder="Username" />
              
                </div>
                <div >
                <label htmlFor="nab-login-password" className="nab-form__label2">
                        <b>Password<span style={{ color: 'red' }}>*</span></b>
                      </label>
                  <div className="password-input-container">    
                  <input type={showPassword1 ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} name="password" id="nab-login-password" class="nab-form__input" placeholder="Password" />
                  <span className="password-toggle-login" onClick={toggleShowPassword1}>
                {showPassword1 ? "Hide" : "Show"}
              </span>
             </div>
                </div>
                <div>
                  <input type="submit" value="Login" id="nab-login-submit-btn" />
                </div>
              </form>
              {error && <p style={{ color: 'red', marginLeft: '130px', marginTop:'10px' }}>{error}</p>} {}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;
