import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from '../signup.svg';
import Footer from '../Footer';
import './CompanySignup.css'; 
import MessageModal from '../ModalWindows/MessageModal';

export default function Signup() {
  const [loggedIn, setLoggedIn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Add state for name
  const [designation, setDesignation] = useState(''); // Add state for designation
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);

  const toggleShowPassword1 = () => {
    setShowPassword1((prevShowPassword) => !prevShowPassword);
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    
    if (!username || !email || !password || !name || !username.trim() || !email.trim() || !name.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if(username.length < 3 )
    {
      setError('Username must be at least 3 characters.')
      return;
    }
    if(password.length < 6 )
    {
      setError('Password must be at least 6 characters.')
      return;
    }
    if(name.length < 6 )
    {
      setError('Name must be at least 6 characters.')
      return;
    }



    try {
      
      const response = await axios.post('http://localhost:8000/komal/companysignup', { username, email, password, name, designation });

      
      if (response.data.company) {
       
        setMessage('Request to register company successfully sent! Your request will be reviewed, shortly.');
        setUsername('')
        setDesignation('')
        setEmail('')
        setPassword('')
        setName('')
        setError('')
        setOpenModal(true);
      } else {
        if (response.data.error)
            setError('Could not register. Username/Email already exists.');
        else
            setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      
      console.error(err);
      //alert(JSON.stringify(err))
      setError('Something went wrong. Please try again.');
    }
  };

  return (<>
    <div>
      <div className='kom-signup-container'>
        <div id="nab-wraplogin">
          <div className="nab-wrapper-login">
            <div className="nab-loginpage-right-side">
              <div className="kom-login-right-innerbox">
                <div>
                  <h1 id="welcomeback">Register your Company</h1>
                  <h3 id="welcomeback-subheading">Register to streamline your hiring process with VHA.</h3>
                  <form className='nisa-sign-con' onSubmit={handleSignup}>
                    <div>
                      <label htmlFor="nab-login-username" className="nab-form__label2">
                        <b>Username<span style={{ color: 'red' }}>*</span></b>
                      </label>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="nab-login-username2" className="nab-form__input" placeholder="Username" />
                    </div>
                    <div>
                      <label htmlFor="nab-login-name" className="nab-form__label2">
                        <b>Name<span style={{ color: 'red' }}>*</span></b>
                      </label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" id="nab-login-name" className="nab-form__input" placeholder="Name" />
                    </div>
                    <div>
                      <label htmlFor="nab-login-email" className="nab-form__label2">
                       <b>Email<span style={{ color: 'red' }}>*</span></b> 
                      </label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="nab-login-email" className="nab-form__input" placeholder="Email" />
                    </div>
                    <div>
                      <label htmlFor="nab-login-password" className="nab-form__label2">
                        <b>Password<span style={{ color: 'red' }}>*</span></b>
                      </label>
                      <div className="password-input-container">
                      <input type={showPassword1 ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} name="password" id="nab-login-password" className="nab-form__input" placeholder="Password" />
                      <span className="password-toggle-login" onClick={toggleShowPassword1}>
                {showPassword1 ? "Hide" : "Show"}
              </span>
            </div>
                    </div>
                    <div>
                      <input type="submit" value="Register" id="nab-login-submit-btn" />
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
      </div>
      <Footer />
    </div>
    <MessageModal
      isOpen={openModal}
      message={message}
      title={"Registration Requested!"}
      closeModal={() => {
        setOpenModal(false);
      }}
    />
  </>
  );
}
