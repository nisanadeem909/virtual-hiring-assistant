import React from 'react';
import './formquestion.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';

export default function Question({statement, answer1,answer2}) {
 // const navigate=useNavigate();
  return (
    <div className="question-container">
      <div className="question-statement">
        {statement}<span id="nab-form-required-field">*</span>:
      </div>
      <div className="options">
            
            <label id="options-label">
                <input type="radio" name="education" value="yes" />
                {answer1}
            </label>

            <label id="options-label">
                <input type="radio" name="education" value="no" />
                {answer2}
            </label>

      </div>
    
    </div>
  );
}


