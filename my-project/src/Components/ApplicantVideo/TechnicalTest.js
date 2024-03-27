import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img from './DFS.png'
import img1 from './stack.png'
import img2 from './queue.png'
import img3 from './tree.png'
import axios from 'axios';


function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="nab-confirmation-popup-overlay">
      <div className="nab-confirmation-popup">
        <p id="nab-conf-msg">{message}</p>
        <div className="nab-confirmation-buttons">
          <button  className="nisa-nabeeha-submit-button" onClick={onConfirm}>Confirm</button>
          <button  className="nisa-nabeeha-submit-button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
export default function TechnicalTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [timer, setTimer] = useState();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [msg,setMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [answeredQuestionsIndices, setAnsweredQuestionsIndices] = useState([]);
  const [questions,setQuestions] = useState([{question: [
    {
      type: 'text',
      text: '',
    }], options: ['']}]);
  const [answeredQuestions, setAnsweredQuestions] = useState(Array(questions.length).fill(false)); // State to track answered questions

  // Function to retrieve timer value from local storage
  const getTimerFromLocalStorage = () => {
    const storedTimer = localStorage.getItem('timer');
    return storedTimer ? JSON.parse(storedTimer) : null;
  };
    useEffect(() => {
      // Retrieve timer value from local storage on component mount
    const storedTimer = getTimerFromLocalStorage();
    if (storedTimer !== null) {
      setTimer(storedTimer);
    }
      if (location.state && location.state.job) {
        setJob(location.state.job);
        var param = { job: location.state.job._id };
        axios.post("http://localhost:8000/komal/getjobtest", param)
          .then((response) => {
            if (response.data.status === "success") {
              //alert(JSON.stringify(response.data.form))
              setQuestions(response.data.form.questions);
              setTimer(response.data.form.duration * 60);
              setAnsweredQuestions(Array(response.data.form.questions.length).fill(false)); // Initialize answeredQuestions state
            } else {
              console.error(response.data.error);
              alert(response.data.error);
            }
          })
          .catch(function (error) {
            console.error("Axios Error:" + error);
            //alert(error);
          });
      } else {
        navigate(-1);
      }
    }, [location.state, navigate]);

    useEffect(() => {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          // Save timer value to local storage on every change
          localStorage.setItem('timer', JSON.stringify(prevTimer));
          return prevTimer > 0 ? prevTimer - 1 : 0;
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
  const handleConfirm=()=>{
    
  const email = sessionStorage.getItem('email');
    
   const param = {applicantEmail:email,jobID:location.state.job._id}
   
    
    
  }
  const handleSubmit = () => {
   
   setShowConfirmation(true)
   const email = sessionStorage.getItem('email');
   const param = { applicantEmail: email, jobID: location.state.job._id,timeTaken: (60 * 60) - timer  };
   axios.post("http://localhost:8000/nabeeha/evaluatemytestplease", param)
         .then((response) => { 
           //alert(JSON.stringify(response.data))
           navigate('done')
         })
         .catch(function (error) {
          //alert(error)
         });


   localStorage.removeItem('timer');
    localStorage.removeItem('videoFormTimer');
  navigate('done') //UNCOMMENT LATER LAAZMI

  };

  const evaluateTest = ()=>{
    
  }
  const handleAnswer = (index) => {
    
    setMsg('')
    if (!selectedOptions[index]) {
      //alert('No option selected'); 
      setMsg("No option selected")
      return; 

    }

    //this handles the button disabling feature
    const updatedAnsweredQuestionsIndices = [...answeredQuestionsIndices, index];
    setAnsweredQuestionsIndices(updatedAnsweredQuestionsIndices);


    //this handles the updated answers array
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
      .catch(function (error) {
        //alert(error);
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
                    disabled={answeredQuestions[index]} // Disable radio button if question is answered
                  />
                  {option}
                </li>
              ))}
            </ul>
            <button
              className="nisa-nabeeha-submit-button"
              onClick={() => handleAnswer(index)} // Pass question index to handleAnswer
              disabled={answeredQuestionsIndices.includes(index)} // Disable "Submit Answer" button if question is answered
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
