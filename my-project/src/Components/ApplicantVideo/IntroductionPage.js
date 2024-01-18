import React, { useState, useEffect } from 'react';
import './ApplicantVideo.css';
import { useLocation, useNavigate } from 'react-router-dom';
import img1 from './interview.jpg';

export default function IntroductionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showBestOfLuck, setShowBestOfLuck] = useState(false);
  const [showHeading, setShowHeading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job);
    } else {
      navigate(-1);
    }
  }, [location.state, navigate]);

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

                <p className='nisa-intro1-title'>
                  <span className='nisa-intro-title'>Deadline:</span> {formatDate(job.CVDeadline)}
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
                    <li>Submit your video within the specified 15-minute time frame.</li>
                    <li>Once the video is uploaded, Part 2: the technical test (MCQs) will automatically start.</li>
                    <li>Complete the technical test within the given 1-hour time limit.</li>
                    <li>The interview link will be active on the specified date.</li>
                    <li>Do not refresh or navigate away from the page during the interview process.</li>
                    <li>Check your internet connectivity to avoid interruptions.</li>
                    <li>Click the "Start" button when you are ready to begin the interview.</li>
    
                  </ul>
                </div>

                <p className='nisa-intro2-title'>
                  <span className='nisa-intro3-title'>Important:</span> Position your camera to capture a vision like shown below.
                </p>

                <img className='nisa-interview-img' src={img1} alt="Interview Demo" />
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
    </div>
  );
}
