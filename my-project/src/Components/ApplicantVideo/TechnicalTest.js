import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="nab-confirmation-popup-overlay">
      <div className="nab-confirmation-popup">
        <p id="nab-conf-msg">{message}</p>
        <div className="nab-confirmation-buttons">
          <button className="nisa-nabeeha-submit-button" onClick={onConfirm}>Confirm</button>
          <button className="nisa-nabeeha-submit-button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function TechnicalTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [msg, setMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [answeredQuestionsIndices, setAnsweredQuestionsIndices] = useState([]);
  const [questions, setQuestions] = useState([{ question: [{ type: 'text', text: '' }], options: [''] }]);
  const [answeredQuestions, setAnsweredQuestions] = useState(Array(questions.length).fill(false));

  const [duration,setDuration] = useState(0)
  useEffect(() => {
    //alert("Hello")
    //alert(location.state.job)
 


    const storedTimer = localStorage.getItem('timer');
    if (storedTimer !== null) {
      setTimer(JSON.parse(storedTimer));
    }

    if (location.state && location.state.job) {
      setJob(location.state.job);
      const param = { job: location.state.job._id };
      axios.post("http://localhost:8000/komal/getjobtest", param)
        .then((response) => {
          if (response.data.status === "success") {
            setQuestions(response.data.form.questions);
            const savedTimer = localStorage.getItem('timer');
            if (savedTimer === null) {
              setTimer(response.data.form.duration * 60);

              setDuration(response.data.form.duration)
            }
            setAnsweredQuestions(Array(response.data.form.questions.length).fill(false));
          } else {
            console.error(response.data.error);
            alert(response.data.error);
          }
        })
        .catch((error) => {
          console.error("Axios Error:" + error);
        });
    } else {
      alert("Redirecting")
      navigate(-1);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer > 0 ? prevTimer - 1 : 0;
        localStorage.setItem('timer', JSON.stringify(newTimer));
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleOptionChange = (questionId, selectedOption) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: selectedOption,
    }));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    handleSubmit();
    setShowConfirmation(false);
  };

  const handleSubmit = () => {
    const email = sessionStorage.getItem('email');
    const initialDuration = duration * 60; // assuming duration is in minutes
    const timeTaken = initialDuration - timer;

   
    // Calculate the time taken in hours, minutes, and seconds
    const hours = Math.floor(timeTaken / 3600);
    const minutes = Math.floor((timeTaken % 3600) / 60);
    const seconds = timeTaken % 60;
    const timeTakenFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    //alert(`You took ${timeTakenFormatted} to complete the test.`);
    //console.log(hours + ","  + minutes +  "," + seconds)

    //timeTaken format error(FIX IT)

    const param = { applicantEmail: email, jobID: location.state.job._id, timeTaken: timeTaken };//, timeTaken: timeTakenFormatted

    axios.post("http://localhost:8000/nabeeha/evaluatemytestplease", param)
      .then((response) => {
        localStorage.removeItem('timer');
        localStorage.removeItem('videoFormTimer');
        navigate('done');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAnswer = (index) => {
    setMsg('');
    if (!selectedOptions[index]) {
      setMsg("No option selected");
      return;
    }

    const updatedAnsweredQuestionsIndices = [...answeredQuestionsIndices, index];
    setAnsweredQuestionsIndices(updatedAnsweredQuestionsIndices);

    const updatedAnsweredQuestions = [...answeredQuestions];
    updatedAnsweredQuestions[index] = true;
    setAnsweredQuestions(updatedAnsweredQuestions);

    const param = {
      applicantEmail: sessionStorage.getItem("email"),
      jobID: location.state.job._id,
      answers: selectedOptions
    };
    axios.post("http://localhost:8000/nabeeha/submitquestionanswer", param)
      .then((response) => {
        // Handle response if needed
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="post-jobnew-container">
      <div className='video-header'>
        <h3 className='nisa-video-heading1'>Part 2: Technical Test</h3>
        <div className='nisa-timer-div'>
          <h3 className='nisa-video-timer'>{formatTime(timer)}</h3>
        </div>
      </div>
      <hr className='nisa-horizontal-line'></hr>
      <p id="nab-vid-imp-msg"><b>Important: Click submit for every question individually. Otherwise your answers will NOT be submitted.</b></p>
      <div className="question-list">
        {questions.map((question, index) => (
          <div key={index} className="question-container">
            {question.question.map((questionItem, questionIndex) => (
              <React.Fragment key={questionIndex}>
                <p className='nisa-t-q'>{questionItem.text}</p>
                {questionItem.type === 'image' && (
                  <img className='nisa-t-img' src={`http://localhost:8000/routes/questionimages/` + questionItem.imageUrl} alt="Question" />
                )}
                {questionItem.type === 'code' && (
                  <pre className='nisa-code'>{questionItem.code}</pre>
                )}
              </React.Fragment>
            ))}
            <ul>
              {question.options.map((option, optionIndex) => (
                <li className='nisa-t-a' key={optionIndex}>
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    checked={selectedOptions[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                    disabled={answeredQuestions[index]}
                  />
                  {option}
                </li>
              ))}
            </ul>
            <button
              className="nisa-nabeeha-submit-button"
              onClick={() => handleAnswer(index)}
              disabled={answeredQuestionsIndices.includes(index)}
            >
              Submit Answer
            </button>
            <div>{msg}</div>
            <label className='ktest-app-points'>{question.points} Point(s)</label>
          </div>
        ))}
      </div>
      {showConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to end the test?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <button className="nisa-submit-button" onClick={() => handleSubmit()}>
        End Test
      </button>
    </div>
  );
}
