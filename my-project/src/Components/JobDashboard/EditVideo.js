import React, { useEffect, useState } from 'react' 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import ReactModal from 'react-modal';

// Copy of VideoInterviewQuestion.js

export default function EditVideo(job,test) {
    const [videoDuration, setVideoDuration] = useState(test.duration);
    const [traits, setTraits] = useState(test.acceptabilityTraits);
    const [questions, setQuestions] = useState(test.questions);
    const [phase, setPhase] = useState(1);

    const handleNext = () => {
        setPhase(phase + 1);
      };
    
      const handleBack = () => {
        setPhase(phase - 1);
      };

    const handleSaveVideoData = () => {
        const updatedTest = {
          ...test,
          duration: videoDuration,
          acceptabilityTraits: traits,
          questions: questions,
        };
    
        axios.post("http://localhost:8000/komal/updatejobtest", { jobID: job.jobID, test: updatedTest })
        .then((response) => {
          if (response.data.status === "success") {
            // Handle success response
          } else {
            // Handle error response
          }
        })
        .catch(function (error) {
          console.error("Axios Error:" + error);
          
        });
      
      };
    
  
    const handleVideoDurationChange = (e) => {
      setVideoDuration(e.target.value);
    };
  
    const handleTraitChange = (e, traitIndex) => {
      const { name, value } = e.target;
      setTraits((prevTraits) =>
        prevTraits.map((trait, index) =>
          index === traitIndex ? { ...trait, [name]: value } : trait
        )
      );
    };
  
    const handleQuestionTextChange = (index, event) => {
      const newQuestions = [...questions];
      newQuestions[index] = event.target.value;
      setQuestions(newQuestions);
    };
  
    const addQuestion = () => {
      setQuestions([...questions, ""]);
    };
  
    const deleteQuestion = (index) => {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    };
  
    return (
      <div>
        {phase === 1 && (
          <div>
            <p className="n-video-warning">Note: The video recorded by the applicant will be of 5 minutes. The time given to the applicant for recording this 5-minute video is recommended to set between 15-20 minutes.</p>
            <div className='nnab-createformpage-btns'>
              <div id="nab-vid-interview-btns">
                <div className="video-options">
                  <label className='n-l-vd'>Video Submission Time (minutes):</label>
                  <input
                    type="number"
                    min="10"
                    value={videoDuration}
                    onChange={handleVideoDurationChange}
                    className='n-vd-dur'
                  />
                </div>
                <button className='n-nab-createformpage-cancelbtn'>Discard</button>
                <button className='kcreateformpage-savebtn' onClick={handleNext}>Next</button>
              </div>

            </div>
          </div>
        )}
        {phase === 2 && (
          <div className='nab-set-acceptability-criteria'>
          {traits.map((trait, index) => (
            <div key={index} className="trait-item">
              <label>{trait.trait}:</label>
              <select
                value={trait.weight}
                onChange={(e) => handleTraitChange(e, index)}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      
        )}
        {phase === 3 && (
          <div>
            <div>
              <h4>Select Importance Percentage for Video Interview and Technical Test</h4>
              <div>
                <div>
                  <label>Video Interview:</label>
                  <input type="number" />
                  <span>%</span>
                </div>
                <div>
                  <label>Technical Test:</label>
                  <input type="number" disabled />
                  <span>%</span>
                </div>
              </div>
            </div>
            <button onClick={handleBack}>Back</button>
            <button onClick={handleSaveVideoData}>Save</button>
          </div>
        )}
        <div>
          {/* Render questions */}
          {phase === 1 && (
            
            <div>
              {questions.map((question, index) => (
                <div key={index}>
                  <div className='nkformquestion-con' tabIndex="0">
                    <div className='kformquestion-header'>
                      <label className='kformquestion-header-label'>
                        <b>Question</b>
                        <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                      </label>
                      <textarea
                        className='kformquestion-textbox'
                        value={question}
                        onChange={(event) => handleQuestionTextChange(index, event)}
                      ></textarea>
                    </div>
                    <div className='kformquestion-footer'>
                      <br></br>
                      <button className='nabformquestion-question-delete' onClick={() => deleteQuestion(index)}>Delete Question</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className='nnkcreateformpage-addq-con'>
                <button className='nkcreateformpage-addq' onClick={addQuestion}>+</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
