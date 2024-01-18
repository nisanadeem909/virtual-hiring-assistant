import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img from './DFS.png'
import img1 from './stack.png'
import img2 from './queue.png'
import img3 from './tree.png'

export default function TechnicalTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [timer, setTimer] = useState(60 * 60);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job);
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

  
  const questions = [
    {
      id: 1,
      type: 'text',
      text: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    },
    {
      id: 2,
      type: 'image',
      imageUrl: img,
      question: 'What is shown in the image?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
    },
    {
      id: 3,
      type: 'code',
      code: 'console.log("Hello, World!");',
      question: 'What will be printed to the console?',
      options: ['Hello, World!', 'Undefined', 'Error', 'NaN'],
    },
    {
      id: 4,
      type: 'text',
      text: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    },
    {
      id: 5,
      type: 'image',
      imageUrl: img3,
      question: 'What is shown in the second image?',
      options: ['Option X', 'Option Y', 'Option Z', 'Option W'],
    },
    {
      id: 6,
      type: 'code',
      code: 'for (let i = 0; i < 5; i++) { console.log(i); }',
      question: 'What will be printed to the console?',
      options: ['0 1 2 3 4', '1 2 3 4 5', '0 1 2 3', 'Error'],
    },
    {
      id: 7,
      type: 'text',
      text: 'Which country is known as the Land of the Rising Sun?',
      options: ['China', 'Japan', 'South Korea', 'Thailand'],
    },
    {
      id: 8,
      type: 'image',
      imageUrl: img2,
      question: 'What is shown in the third image?',
      options: ['Option M', 'Option N', 'Option O', 'Option P'],
    },
    {
      id: 9,
      type: 'code',
      code: 'function addNumbers(a, b) { return a + b; }',
      question: 'What does the addNumbers function do?',
      options: ['Multiplies numbers', 'Divides numbers', 'Adds numbers', 'Subtracts numbers'],
    },
    {
      id: 10,
      type: 'text',
      text: 'Which ocean is the largest?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Southern Ocean', 'Pacific Ocean'],
    },

    
    
  ];
  
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
        {questions.map((question) => (
          <div key={question.id} className="question-container">
            {question.type === 'text' && (
              <React.Fragment>
                <p className='nisa-t-q'>{question.text}</p>
                <ul>
                  {question.options.map((option, index) => (
                    <li className='nisa-t-a' key={index}>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option}
                        checked={selectedOptions[question.id] === option}
                        onChange={() => handleOptionChange(question.id, option)}
                      />
                      {option}
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            )}
            {question.type === 'image' && (
              <React.Fragment>
                <img className='nisa-t-img' src={question.imageUrl} alt="Question" />
                <p className='nisa-t-q'>{question.question}</p>
                <ul>
                  {question.options.map((option, index) => (
                    <li className='nisa-t-a' key={index}>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option}
                        checked={selectedOptions[question.id] === option}
                        onChange={() => handleOptionChange(question.id, option)}
                      />
                      {option}
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            )}
            {question.type === 'code' && (
              <React.Fragment>
                <pre className='nisa-code'>{question.code}</pre>
                <p className='nisa-t-q'>{question.question}</p>
                <ul>
                  {question.options.map((option, index) => (
                    <li className='nisa-t-a' key={index}>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option}
                        checked={selectedOptions[question.id] === option}
                        onChange={() => handleOptionChange(question.id, option)}
                      />
                      {option}
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
      <button className="nisa-submit-button" onClick={handleSubmit}>
      Submit
    </button>
    </div>
  );
}
