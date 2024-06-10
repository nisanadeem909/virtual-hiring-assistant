import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img1 from './interview.jpg';

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="nab-confirmation-popup-overlay">
      <div className="nab-confirmation-popup">
        <p id="nab-conf-msg">{message}</p>
        <div className="nab-confirmation-buttons">
          <button className="nisa-nabeeha-submit-button" onClick={onCancel}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function VideoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState();
  const [timer, setTimer] = useState();
  const [timeLimitReached, setTimeLimitReached] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [job, setJob] = useState(null);
  const [allquestions, setQuestions] = useState([]);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.job) {
        setJob(location.state.job);

        const param = { jobID: location.state.job._id };
        try {
          const response = await axios.post("http://localhost:8000/nabeeha/getvideointerviewquestions", param);
          setQuestions(response.data.questions);

          setDuration(response.data.duration);
          const savedTimer = localStorage.getItem('videoFormTimer');
          setTimer(savedTimer ? parseInt(savedTimer) : response.data.duration * 60);
          setLoading(false);
        } catch (error) {
          alert(error);
        }
      } else {
        navigate(-1);
      }
    };

    fetchData();
  }, [location.state, navigate]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          localStorage.setItem('videoFormTimer', prevTimer.toString());
          return prevTimer - 1;
        } else {
          clearInterval(countdownInterval);
          setTimeLimitReached(true);
          upload();
          navigate('test', { state: { job } });
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timer, navigate, job]);

  useEffect(() => {
    const savedTimer = localStorage.getItem('videoFormTimer');
    if (savedTimer) {
      setTimer(parseInt(savedTimer));
    }
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mpeg', 'video/wmv'];

      if (!validVideoTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please upload a video file.');
        setVideoFile(null);
        event.target.value = null; // Reset the file input
        return;
      }

      setErrorMessage('');
      setVideoFile(file);
    }
  };

  const handleNextButtonClick = () => {
    if (!videoFile && !timeLimitReached) {
      setShowConfirmationPopup(true);
    } else {
      upload();
      navigate('video/test', { state: { job } });
    }
  };

  const handleConfirmSubmission = () => {
    setShowConfirmationPopup(false);
  };

  const upload = () => {
    const formData = new FormData();
    formData.append("Image", videoFile);
    formData.append("Email", sessionStorage.getItem('email'));
    formData.append("JobID", location.state.job._id);

    axios.post('http://localhost:8000/nabeeha/uploadapplicantvideo', formData)
      .then(res => {})
      .catch(err => {
        alert(err);
      });
  };

  return (
    <div className="post-jobnew-container">
      <div className='video-header'>
        <h3 className='nisa-video-heading1'>Part 1: Video Interview</h3>
        <div className='nisa-timer-div'>
          <h3 className='nisa-video-timer'>{formatTime(timer)}</h3>
        </div>
      </div>

      <hr className='nisa-horizontal-line'></hr>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='video-mid'>
          <h4>Record a maximum 5-minute video answering the following questions:</h4>
          <ul className='nisa-v-q'>
            {allquestions.map((question, index) => (
              <li className='nisa-v-q2' key={index}>{question}</li>
            ))}
          </ul>

          <p className='nisa-intro2-title'>
            <span className='nisa-intro3-title'>Important:</span> Position your camera to capture a vision like shown below.
          </p>

          <img className='nisa-interview-img' src={img1} alt="Interview Demo" />
          <p className='nisa-intro2-title'>
            <b>Press the next button once you have uploaded the video</b>
          </p>
          <div className='nisa-v-btns'>
            <input className='upload-v-btn1' type='file' accept='video/*' onChange={handleFileChange} />
            <button className='upload-video-btn' onClick={handleNextButtonClick} disabled={timeLimitReached}>
              {timeLimitReached ? 'Time Limit Reached' : 'Next'}
            </button>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )}
      {showConfirmationPopup && (
        <ConfirmationPopup
          message="You cannot proceed before submitting a video file."
          onConfirm={handleConfirmSubmission}
          onCancel={() => setShowConfirmationPopup(false)}
        />
      )}
    </div>
  );
}
