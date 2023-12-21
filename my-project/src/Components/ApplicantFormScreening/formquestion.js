import React from 'react';
import './formquestion.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function Question({ statement, answer1, answer2, setUserAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <div className="question-container">
      <div className="question-statement">
        {statement}<span id="nab-form-required-field">*</span>:
      </div>
      <div className="options">
        <label id="options-label">
          <input
            type="radio"
            
            value={answer1}
            checked={selectedAnswer === answer1}
            onChange={() => {
              setSelectedAnswer(answer1);
              setUserAnswer(answer1);
            }}
          />
          {answer1}
        </label>

        <label id="options-label">
          <input
            type="radio"
            
            value={answer2}
            checked={selectedAnswer === answer2}
            onChange={() => {
              setSelectedAnswer(answer2);
              setUserAnswer(answer2);
            }}
          />
          {answer2}
        </label>
      </div>
    </div>
  );
}


