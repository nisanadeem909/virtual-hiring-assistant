import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VideoForm() {
  const [timer, setTimer] = useState(15 * 60);
  const [timeLimitReached, setTimeLimitReached] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdownInterval);
          setTimeLimitReached(true);
          // Trigger navigation logic here after 15 minutes
          navigate('test', { state: { job } })
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    if (location.state && location.state.job) {
     
      setJob(location.state.job);
    } else {
      navigate(-1);
    }
  }, [location.state, navigate]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
  };

  const handleNextButtonClick = () => {
    navigate('test', { state: { job } })
  };

  const nextButtonDisabled = timeLimitReached;

  const questions = [
    "Question 1: What motivated you to apply for this position?",
    "Question 2: Can you share an experience where you successfully worked in a team?",
    "Question 3: How do you handle challenging situations at work?",
    "Question 4: What skills or qualities make you a good fit for this role?",
    "Question 5: Describe a project or task where you demonstrated leadership skills.",
  ];

  return (
    <div className="post-jobnew-container">
      <div className='video-header'>
        <h3 className='nisa-video-heading1'>Part 1: Video Interview</h3>
        <div className='nisa-timer-div'>
          <h3 className='nisa-video-timer'>{formatTime(timer)}</h3>
        </div>
      </div>

      <hr className='nisa-horizontal-line'></hr>

      <div className='video-mid'>
        <h4>Record a maximum 5-minute video answering the following questions:</h4>
        <ul className='nisa-v-q'>
          {questions.map((question, index) => (
            <li className='nisa-v-q2' key={index}>{question}</li>
          ))}
        </ul>

        <p className='nisa-intro2-title'>
          <span className='nisa-intro3-title'>Important:</span> Press the next button once you have uploaded the video. The interview will move to the next part automatically after 15 minutes.
        </p>

        <div className='nisa-v-btns'>  
        
          <input className='upload-v-btn1' type='file' accept='video/*' onChange={handleFileChange} />
          <button className='upload-video-btn' onClick={handleNextButtonClick} disabled={nextButtonDisabled}>
            {nextButtonDisabled ? 'Time Limit Reached' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
