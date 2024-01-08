import React from 'react';
import './profile.css';
import './changepassword.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';
import profilepic from './profilepic.jpeg'
import { useState,useEffect } from 'react';



import axios from 'axios';

export default function Profile() {
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  
    useEffect(() => {
      const sessionID = sessionStorage.getItem('sessionID');
      setUsername(sessionID);
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      switch (name) {
        case 'currentPassword':
          setCurrentPassword(value);
          break;
        case 'newPassword':
          setNewPassword(value);
          break;
        case 'confirmNewPassword':
          setConfirmNewPassword(value);
          break;
        default:
          break;
      }
      
    };
  
    const handleSave = async (username1) => {
      // Implement the logic to save updated details
      const updatedDetails = {
        // Add other details as needed
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      };

      if (!newPassword || !confirmNewPassword || !currentPassword)
      {
        setSuccessMessage('');
        setErrorMessage('Please fill all fields.');
        return;
      }
  
      if (newPassword != confirmNewPassword) {
        //alert('Passwords do not match. Please re-enter.');
        setSuccessMessage('');
        setNewPassword('');
        setConfirmNewPassword('');
        setCurrentPassword('');
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
  
      var param = {'username':username1,'oldPassword':currentPassword,'newPassword':newPassword};
        axios.post("http://localhost:8000/komal/changepassword",param).then((response) => {
           // alert(JSON.stringify(response.data));
           if (response.data.status == "success"){
              setSuccessMessage('Password updated successfully!');
              setErrorMessage('');
              setNewPassword('');
              setConfirmNewPassword('');
              setCurrentPassword('');
            }
            else 
            {
              setSuccessMessage('');
              setErrorMessage(`Error: ${response.data.error}`);
              setNewPassword('');
              setConfirmNewPassword('');
              setCurrentPassword('');
            }
        })
        .catch(function (error) {
          setSuccessMessage('');
            setErrorMessage('Something went wrong, please try again.');
        });
      
    };
  
    return (
      <div>
        <div id="nab-profile-outer-div-changepassword">
          <div id="nab-profile-details-changepassword">
            <label id="profile-settings">Change Password</label>
            <hr></hr>
            <br></br>
            <div >
                        <label id="nab-profile-label" htmlFor="fullname">Username<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                        <input
                        type="text"
                        id="nab-profile-input"
                        name="fullname"
                        value={username}
                        contentEditable="false"
                    />   
                    </div>
            <div className="profile-field-firstname">
              <label id="nab-profile-label" htmlFor="currentPassword">Current Password<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
              <input
                type="password"
                id="nab-profile-input"
                name="currentPassword"
                value={currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-field">
              <label id="nab-profile-label" htmlFor="newPassword">New Password<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
              <input
                type="password"
                id="nab-profile-input-email"
                name="newPassword"
                value={newPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-field">
              <label id="nab-profile-label" htmlFor="confirmNewPassword">Confirm New Password<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
              <input
                type="password"
                id="nab-profile-input"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleInputChange}
              />
            </div>
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <button type="submit" id="nab-profile-button" onClick={() => handleSave(username)}>Update Password</button>
          </div>
        </div>
        <div className="ft"><Footer /></div>
      </div>
    );
  }