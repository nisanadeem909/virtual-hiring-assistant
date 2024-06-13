import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img1 from './interview.jpg';
import { v4 as uuidv4 } from 'uuid';

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="nab-confirmation-popup-overlay">
      <div className="nab-confirmation-popup">
        <p id="nab-conf-msg">{message}</p>
        <div className="nab-confirmation-buttons">
          <button className="nisa-nabeeha-submit-button" onClick={onConfirm}>Submit & Move to Test</button>
          <button className="nisa-nabeeha-submit-button" onClick={onCancel}>Cancel</button>
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
  const [allQuestions, setQuestions] = useState([]);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(300); // 5 minutes in seconds

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.job) {
        setJob(location.state.job);

        const param = { jobID: location.state.job._id };
        try {
          const response = await axios.post("http://localhost:8000/nabeeha/getvideointerviewquestions", param);
          setQuestions(response.data.questions);

          setDuration(response.data.duration);
          const savedEndTime = localStorage.getItem('videoFormEndTime');
          if (savedEndTime) {
            const remainingTime = Math.max((new Date(savedEndTime).getTime() - new Date().getTime()) / 1000, 0);
            setTimer(Math.floor(remainingTime));
            setLoading(false);
            if (remainingTime <= 0) {
              setTimeLimitReached(true);
            }
          } else {
            const newEndTime = new Date().getTime() + response.data.duration * 60 * 1000;
            localStorage.setItem('videoFormEndTime', new Date(newEndTime).toISOString());
            setTimer(response.data.duration * 60);
            setLoading(false);
          }
        } catch (error) {
         // alert(error);
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
          return prevTimer - 1;
        } else {
          clearInterval(countdownInterval);
          setTimeLimitReached(true);
          upload(videoFile);
          navigate('test', { state: { job } });
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timer, navigate, job, videoFile]);

  useEffect(() => {
    const savedEndTime = localStorage.getItem('videoFormEndTime');
    if (savedEndTime) {
      const remainingTime = Math.max((new Date(savedEndTime).getTime() - new Date().getTime()) / 1000, 0);
      setTimer(Math.floor(remainingTime));
      if (remainingTime <= 0) {
        setTimeLimitReached(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isRecording && recordingTimer > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setRecordingTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            stopRecording();
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(countdownIntervalRef.current);
  }, [isRecording, recordingTimer]);

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
        event.target.value = null; 
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
      upload(videoFile);

    
      
      navigate('test', { state: { job } });
    }
  };

  const upload = (file) => {
    const formData = new FormData();
    formData.append("Image", file);
    formData.append("Email", sessionStorage.getItem('email'));
    formData.append("JobID", location.state.job._id);

    axios.post('http://localhost:8000/nabeeha/uploadapplicantvideo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {})
      .catch(err => {
        //alert(err);
      });
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/mp4' });
      const uniqueFileName = `${uuidv4()}.mp4`;

      const file = new File([blob], uniqueFileName, { type: 'video/mp4' });
      setVideoFile(file);
      recordedChunks.current = [];
    };

    mediaRecorder.start();
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTimer(300); // Reset the recording timer to 5 minutes
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(countdownIntervalRef.current); // Pause the timer
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // Resume the timer
      countdownIntervalRef.current = setInterval(() => {
        setRecordingTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            stopRecording();
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
        });
      }, 1000);
    }
  };

  const discardRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      recordedChunks.current = [];
      setVideoFile(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
    }
    clearInterval(countdownIntervalRef.current);
    setShowSubmitPopup(true); // Show submit confirmation popup
  };

  const confirmSubmitRecording = () => {
    setShowSubmitPopup(false);
    handleNextButtonClick();
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
          <p className='nisa-intro22-title'>
            <span className='nisa-intro3-title'>Position your camera to capture a vision like shown below.</span> 
          </p>
          <img className='nisa-interview-img' src={img1} alt="Interview Demo" />
          <div id="nab-vid-question-box">
            <span>Record a maximum 5-minute video answering the following questions:</span>
          </div>
          <div id="nab-vid-question-box-q">
            <ul className='nisa-v-q'>
              {allQuestions.map((question, index) => (
                <li className='nisa-v-q2' key={index}>{question}</li>
              ))}
            </ul>
          </div>

          <p className='nisa-intro2-title'>
            <b>Once you're ready, click Start Recording. &nbsp; To save, click Stop Recording.</b>
          </p>
          <div className='nisa-v-btns'>
            <div className='nab-btn-vid'>
              {!isRecording ? (
                <button className='upload-video-btn-1' onClick={startRecording} disabled={timeLimitReached}>
                  Start Recording
                </button>
              ) : (
                <>
                  <button className='upload-video-btn-11' onClick={stopRecording} disabled={timeLimitReached}>
                    Submit Recording
                  </button>
                  {isPaused ? (
                    <button className='upload-video-btn-1' onClick={resumeRecording} disabled={timeLimitReached}>
                      Resume Recording
                    </button>
                  ) : (
                    <button className='upload-video-btn-1' onClick={pauseRecording} disabled={timeLimitReached}>
                      Pause Recording
                    </button>
                  )}
                  <button className='upload-video-btn-13' onClick={discardRecording} disabled={timeLimitReached}>
                    Discard Recording
                  </button>
                </>
              )}
              {isRecording && <h3 className='nisa-nab-video-timer'>{formatTime(recordingTimer)}</h3>}
            </div>
            <video ref={videoRef} autoPlay muted className="video-preview"></video>

<div> {/*Delete this div later*/}
            <input className='upload-v-btn1' type='file' accept='video/*' onChange={handleFileChange} />
            <button className='upload-video-btn-1' onClick={handleNextButtonClick} disabled={timeLimitReached}>
              {timeLimitReached ? 'Time Limit Reached' : 'Next'}
            </button>
</div>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )}
      {showConfirmationPopup && (
        <ConfirmationPopup
          message="You cannot proceed before submitting a video file."
          onCancel={() => setShowConfirmationPopup(false)}
        />
      )}
      {showSubmitPopup && (
        <ConfirmationPopup
          message="This action will submit your video and take you to the test section. Continue?"
          onConfirm={confirmSubmitRecording}
          onCancel={() => setShowSubmitPopup(false)}
        />
      )}
    </div>
  );
}
