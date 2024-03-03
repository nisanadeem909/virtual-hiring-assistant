import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img from './DFS.png'
import img1 from './stack.png'
import img2 from './queue.png'
import img3 from './tree.png'
import axios from 'axios';

export default function TechnicalTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [timer, setTimer] = useState(60 * 60);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questions,setQuestions] = useState([{question: [
    {
      type: 'text',
      text: '',
    }], options: ['']}]);

  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job);
      var param = {'job':location.state.job._id};
      axios.post("http://localhost:8000/komal/getjobtest",param).then((response) => {
      // alert(JSON.stringify(response.data));
      if (response.data.status == "success"){
        setQuestions(response.data.form.questions)
        setTimer(response.data.form.duration * 60)
      }
      else {
          console.error(response.data.error)
          alert(response.data.error)
      }
      })
      .catch(function (error) {
        console.error("Axios Error:" + error);
        alert(error)
      });
    } else {
      navigate(-1);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
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

  const handleSubmit = () => {
   navigate('done')
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
                  />
                  {option}
                </li>
              ))}
            </ul>
            <label className='ktest-app-points'>{question.points} Point(s)</label>
          </div>
        ))}
      </div>
      <button className="nisa-submit-button" onClick={handleSubmit}>
      Submit
    </button>
    </div>
  );
}
