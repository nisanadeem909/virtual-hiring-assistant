import React, { useState, useEffect } from 'react';
import './ApplicantVideo.css';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
export default function IntroductionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showBestOfLuck, setShowBestOfLuck] = useState(false);
  const [showHeading, setShowHeading] = useState(true);

 
  const [videoSubmission,setVideoSub] = useState()
  const [techtestLen,setTechTestLen] = useState()
  const [startDate,setStartDate] = useState()
  const [flag,setFlag] = useState(false) //False flag indicates there is time. True means expired.
  const [email,setEmail] = useState('')
  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job);

      setDetails()

      setEmail(sessionStorage.getItem('email'))
      


    } else {
      navigate(-1);
    }
  }, [location.state, navigate]);

  const setDetails =() =>{
    
    const param = { jobID: location.state.job._id};
    axios.post("http://localhost:8000/nabeeha/getvideointerviewdetails", param)
      .then((response) => {
        setVideoSub(response.data.videoSubmissionTime)
        setTechTestLen(response.data.testSubmissionTime)

        
        const startDate = new Date(response.data.startDate);
        const days = response.data.days;
        const currentDate = new Date();
        const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        const isCurrentDateLessThanOrEqual = currentDate <= endDate;
        setFlag(isCurrentDateLessThanOrEqual)

        //alert(currentDate + " < " + endDate + " = " + isCurrentDateLessThanOrEqual)
        //alert(isCurrentDateLessThanOrEqual)

      })
      .catch(function (error) {
        
      });
  }
  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${formattedDate.getDate()}`.padStart(2, '0');
    let hours = formattedDate.getHours();
    const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${amOrPm}`;
  };

  const handleStartTest = () => {
    setCountdown(5);
    setShowCountdown(true);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setShowBestOfLuck(true);
      setTimeout(() => {
        
        navigate('video', { state: { job } })
      }, 1000);
    }, 5000);

   
    setShowHeading(false);
  };

  return (
    <div className="post-jobnew-container">
      {!flag ? (
        <div className="nab-intro-head">
          <h1>Sorry. This job link form has expired.</h1>
          <p>If you think this is a mistake, please contact HR.</p>
        </div>
      ) : (
        <div className="nisa-intro-head">
          {showHeading && <h3 className='nisa-intro-heading'>Instructions</h3>}
          {showCountdown ? (
            <div className='countdown-container'>
              <p className='countdown-text'>{countdown}</p>
            </div>
          ) : (
            <>
              {job && (
                <div>
                  <p className='nisa-intro1-title'>
                    <span className='nisa-intro-title'>Job Title:</span> {job.jobTitle}
                  </p>
  
                  <div className='nisa-points-section'>
                    <h4>Points to Note:</h4>
                    <ul>
                      <li>The interview will consist of two parts: a non-technical and a technical phase.</li>
                      <li>Part 1: Upload a 5-minute video answering the provided questions.</li>
                      <li>Ensure your environment is well-lit and quiet for optimal video quality.</li>
                      <li>Make sure your camera and microphone are working correctly.</li>
                      <li>Position your camera at a distance to capture a clear view. A demo position picture will be attached below.</li>
                      <li>Review the provided questions before starting to record the video.</li>
                      <li><b>Submit your video within the specified {videoSubmission}-minute time frame.</b></li>
                      <li>Once the video is uploaded, Part 2: the technical test (MCQs) will automatically start.</li>
                      <li><b>Complete the technical test within the given {techtestLen}-minute frame.</b></li>
                      <li>The interview link will be active on the specified date.</li>
                      <li>Do not refresh or navigate away from the page during the interview process.</li>
                      <li>Check your internet connectivity to avoid interruptions.</li>
                      <li>Click the "Start" button when you are ready to begin the interview.</li>
                    </ul>
                  </div>
  
                  
                </div>
              )}
  
              <button className='nisa-inter-btn' onClick={handleStartTest}>
                Start Test
              </button>
            </>
          )}
  
          {showBestOfLuck && (
            <div className='good-luck-message'>
              <p>Best of Luck!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
