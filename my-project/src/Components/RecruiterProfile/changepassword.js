import React, { useState, useEffect } from 'react';
import './profile.css';
import './changepassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

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

  const toggleShowPassword1 = () => {
    setShowPassword1((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowPassword2 = () => {
    setShowPassword2((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowPassword3 = () => {
    setShowPassword3((prevShowPassword) => !prevShowPassword);
  };

  const handleSave = async (username1) => {
    const updatedDetails = {
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    };

    if (!newPassword || !confirmNewPassword || !currentPassword) {
      setSuccessMessage('');
      setErrorMessage('Please fill all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSuccessMessage('');
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentPassword('');
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const param = {
      username: username1,
      oldPassword: currentPassword,
      newPassword: newPassword,
    };

    try {
      const response = await axios.post("http://localhost:8000/komal/changepassword", param);
      if (response.data.status === "success") {
        setSuccessMessage('Password updated successfully!');
        setErrorMessage('');
        setNewPassword('');
        setConfirmNewPassword('');
        setCurrentPassword('');
      } else {
        setSuccessMessage('');
        setErrorMessage(`Error: ${response.data.error}`);
        setNewPassword('');
        setConfirmNewPassword('');
        setCurrentPassword('');
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Something went wrong, please try again.');
    }
  };

  return (
    <div>
      <div id="nab-profile-outer-div-changepassword">
        <div id="nab-profile-details-changepassword">
          <label id="profile-settings">Change Password</label>
          <hr></hr>
          <br></br>
          <div>
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
            <div className="password-input-container">
            <input
              type={showPassword1 ? "text" : "password"}
              id="nab-profile-input"
              name="currentPassword"
              value={currentPassword}
              onChange={handleInputChange}
            />
             <span className="password-toggle" onClick={toggleShowPassword1}>
                {showPassword1 ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <div className="profile-field">
            <label id="nab-profile-label" htmlFor="newPassword">New Password<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
            <div className="password-input-container">
              <input
                type={showPassword2 ? "text" : "password"}
                id="nab-profile-input-email"
                name="newPassword"
                value={newPassword}
                onChange={handleInputChange}
              />
              <span className="password-toggle" onClick={toggleShowPassword2}>
                {showPassword2 ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <div className="profile-field">
            <label id="nab-profile-label" htmlFor="confirmNewPassword">Confirm New Password<span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
            <div className="password-input-container">
              <input
                type={showPassword3 ? "text" : "password"}
                id="nab-profile-input"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleInputChange}
              />
              <span className="password-toggle" onClick={toggleShowPassword3}>
                {showPassword3 ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          <button type="submit" id="nab-profile-button" onClick={() => handleSave(username)}>Update Password</button>
        </div>
      </div>
    </div>
  );
}
