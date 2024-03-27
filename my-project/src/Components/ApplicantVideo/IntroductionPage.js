import React, { useState, useEffect } from 'react';
import './ApplicantVideo.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function IntroductionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // State variable to track loading status
  const [job, setJob] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showBestOfLuck, setShowBestOfLuck] = useState(false);
  const [showHeading, setShowHeading] = useState(true);
  const [videoSubmission, setVideoSubmission] = useState();
  const [techTestLen, setTechTestLen] = useState();
  const [startDate, setStartDate] = useState();
  const [flag, setFlag] = useState(false); // False flag indicates there is time. True means expired.
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.state && location.state.job) {
          const jobData = location.state.job;
          setJob(jobData);
  
          const param = { jobID: jobData._id };
          const response = await axios.post("http://localhost:8000/nabeeha/getvideointerviewdetails", param);
          const { startDate, days } = response.data;
  
          const startDateObj = new Date(startDate);
          const endDate = new Date(startDateObj.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
          const currentDate = new Date();
  
          const isWithinValidRange = currentDate >= startDateObj && currentDate <= endDate;
         
          setStartDate(startDateObj);
          setTechTestLen(response.data.testSubmissionTime);
          setVideoSubmission(response.data.videoSubmissionTime);
          setFlag(isWithinValidRange);
          //setFlag(true) //UNCOMMENT LATER LAZZMI
          setLoading(false); // Set loading to false once data is fetched
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, [location.state, navigate]);

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
      {loading ? ( // Render "Loading" message if loading is true
        <div>Loading...</div>
      ) : !flag ? (
        <div className="nab-intro-head">
          <h1>Sorry. This job interview/test is unavailable.</h1>
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
                      <li><b>Complete the technical test within the given {techTestLen}-minute frame.</b></li>
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
