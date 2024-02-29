import React from 'react';
import './formquestion.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
export default function Question({ statement, answers, setUserAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <div className="nab-question-container">
      <div className="question-statement">
        {statement}<span id="nab-form-required-field">*</span>:
      </div>
      <div className="options">
        {answers.map((answer, index) => (
          <label key={index} id="options-label">
            <input
              type="radio"
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => {
                setSelectedAnswer(answer);
                setUserAnswer(answer);
              }}
            />
            {answer}
          </label>
        ))}
      </div>
    </div>
  );
}


