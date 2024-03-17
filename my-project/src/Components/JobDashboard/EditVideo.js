import React, { useEffect, useState } from 'react' 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import ReactModal from 'react-modal';
import img from './traits.png'
import img2 from './per.png'

export default function EditVideo(props) {

  const navigate = useNavigate();
    const [phase, setPhase] = useState(1);
    
    const [videoDuration, setVideoDuration] = useState();
    const [imp, setImp] = useState();
    const [traits, setTraits] = useState([[]]);
    const [questions, setQuestions] = useState([{ question: '' }]);

    const [nvideoDuration, setnewVideoDuration] = useState();
    const [nimp, setnewImp] = useState();
    const [ntraits, setnewTraits] = useState([[]]);
    const [nquestions, setnewQuestions] = useState([]);

    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);
   

    useEffect(() => {
      
      
      const test = props.test;
      setQuestions(test.questions || []);
      setTraits(test.acceptabilityTraits || []);
      setVideoDuration(test.duration || '');
      setImp(test.importance || '');

       
    }, [props.test]);


    const handleNext = () => {
        setPhase(phase + 1);
      };
    
      const handleBack = () => {
        setPhase(phase - 1);
      };

    const handleSaveVideoData = () => {
        const updatedTest = {
          ...props.test,
          duration: videoDuration,
          acceptabilityTraits: traits,
          questions: questions,
          importance: imp,
        };
    
        axios.post(`http://localhost:8000/komal/updatejobtestnisa/${props.job.jobID}`, { test: updatedTest })
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
      const value = e.target.value;
      
      setTraits((prevTraits) =>
        prevTraits.map((trait, index) =>
          index === traitIndex ? { ...trait, weight: value } : trait
        )
      );
    };

    const handlePercentageChange = (event, type) => {
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value >= 10 && value <= 90) {
          if (type === 'videoInterview') {
              setImp(value);
              //setTechnicalTestPercentage(100 - value);
          }
          
      }
      
  };
  
    const handleQuestionTextChange = (index, ev) => {
      
      var text = ev.target.value;
      
      var copy = [...questions];
      
      const updatedCopy = [...copy]; // Create a copy of the array
      updatedCopy[index] = text; // Update the specific question object
      
      setQuestions(updatedCopy); // Set the state with the updated array
      //alert(questions[index].question)
    };
  
    const addQuestion = () => {
      setQuestions([...questions, { question: '' }]);
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
                    defaultValue={videoDuration}
                    onChange={handleVideoDurationChange}
                    className='n-vd-dur'
                  />
                </div>
                <button className='n-nab-createformpage-cancelbtn'>Discard</button>
                <button className='kcreateformpage-savebtn' onClick={handleNext}>Next</button>
              </div>
              <div className='n-kcreateform-questions'>
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
                        defaultValue={question}
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
              <button className='nkcreateformpage-addq' onClick={addQuestion} style={{ marginTop: '10px' }}>+</button>

              </div>
            </div>
            </div>
          </div>
        )}
        {phase === 2 && (
          <div className='nab-set-acceptability-criteria'>
            <div className="nisa-left-section">
            <img className='nisa-vd-img1' src={img} alt="Your Image" />
        </div>
        <hr className='nisa-vertical-line' />
        <div className="nisa-right-section">
        <h2 className='n-trait-head'>Personality Traits</h2>
        <p className='n-trait-p'>Rate the following personality traits from 1 to 10, where 1 is the lowest and 10 is the highest.</p>
            <div className="n-personality-traits">
          {traits.map((trait, index) => (
            <div key={index} className="trait-item">
              <label>{trait.trait}:</label>
              <select
                defaultValue={trait.weight}
                onChange={(e) => handleTraitChange(e, index)}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          ))}
          </div>
          <button className='n2-nab-createformpage-cancelbtn' onClick={handleBack}>Back</button>
          <button className="nisa-createformpage-savebtn" onClick={handleNext}>Next</button>
          </div>
        </div>
      
        )}
        {phase === 3 && (
  <div className='nab-set-acceptability-criteria'>
  <div className="nisa-left-section">
      <img className='nisa-vd-img1' src={img2} alt="Your Image" />
  </div>
  <hr className='nisa-vertical-line2' />
  <div className="nisa-right-section">
<h4 className='n-vd2'>Select Importance Percentage for Video Interview and Technical Test</h4>
    <div className="percentage-inputs">
      <div className="percentage-item">
        <label>Video Interview:</label>
        <input
          type="number"
          defaultValue={imp}
          onChange={(e) => handlePercentageChange(e, 'videoInterview')}
        />
        <span>%</span>
      </div>
      <div className="percentage-item">
        <label>Technical Test:</label>
        <input
          type="number"
          value={100 - imp}
          disabled
        />
        <span>%</span>
      </div>
    </div>
    <button className='n2-nab-createformpage-cancelbtn' onClick={handleBack}>Back</button>
    <button className='nisa-createformpage-savebtn' onClick={handleSaveVideoData}>Save</button>
  </div>
  <MessageModal
             isOpen={openModal}
             message={message}
             title={messageTitle}
             closeModal={() => {
                 setOpenModal(false);
                 if (messageTitle === 'Form Saved') {
                     navigate(-1, { state: { 'jobID': props.job._id } });
                 }
             }}
            
         />
         </div>
)}

       
      </div>
    );
}
