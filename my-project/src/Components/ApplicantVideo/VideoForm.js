import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'


export default function VideoForm() {
  const [duration, setDuration] = useState();
  const [timer, setTimer] = useState(15 * 60); // Default value is 15 otherwise set by UseEffect

  const [timeLimitReached, setTimeLimitReached] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [allquestions, setQuestions] = useState([]);


  const [img,setImg] = useState('./personcircle.png'); //this is the default profilepic
  const [imgSet,setImgSet] = useState("false")

  useEffect(() => {
    if (duration) {
      setTimer(duration*60);
    }
  }, [duration]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } 
        else {
          clearInterval(countdownInterval);
          setTimeLimitReached(true);


          navigate('test', { state: { job } });
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timer, navigate, job]);

  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job);

      const param = { jobID: location.state.job._id };
      axios
        .post("http://localhost:8000/nabeeha/getvideointerviewquestions", param)
        .then((response) => {
          setQuestions(response.data.questions);
          setDuration(response.data.duration);
        })
        .catch(function (error) {
          alert(error);
        });
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
    upload();
    
    navigate('test', { state: { job } }); 
  };

  const nextButtonDisabled = timeLimitReached;

  const upload = () =>{

    //If video file has not been attached. that has been handled on server side. dont worry.
      var fdata = new FormData();
      fdata.append("Image", videoFile);
      fdata.append("Email", sessionStorage.getItem('email'));
      fdata.append("JobID",location.state.job._id)

      axios.post('http://localhost:8000/nabeeha/uploadapplicantvideo',fdata)
      .then(res => {
        
       
    }).catch(
        err=>{
            alert(err)
        });

     
}
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
          {allquestions.map((question, index) => (
            <li className='nisa-v-q2' key={index}>{question}</li>
          ))}
        </ul>

        <p className='nisa-intro2-title'>
          <span className='nisa-intro3-title'>Important:</span> Press the next button once you have uploaded the video
        </p>
          <div className='nisa-v-btns'>
      <input className='upload-v-btn1' type='file' accept='video/*' onChange={handleFileChange} />
      <button className='upload-video-btn' onClick={handleNextButtonClick} disabled={nextButtonDisabled}>
        {nextButtonDisabled ? 'Time Limit Reached' : 'Next'}
      </button>
    </div>
  </div>
</div>

  )}