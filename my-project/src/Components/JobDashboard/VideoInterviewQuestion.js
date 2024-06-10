import React, { useEffect, useState } from 'react' 
import './VideoInterviewQuestion.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import loading from '../images/loading3.gif';
import img from './traits.png'
import img2 from './per.png'




export default function CreateForm(props) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ question: '' }]);
  
  const [job, setJob] = useState({
      'jobTitle': 'Loading..',
      'CVFormLink': 'Loading..',
      'AccCVScore': { $numberDecimal: '0' },
      'CVDeadline': 'dd/mm/yyyy',
      'status': '0',
      'jobDescription': 'Loading..'
  });
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [phase, setPhase] = useState(1);
  
  const [formDeadline, setFormDeadline] = useState('');
  const [videoInterviewPercentage, setVideoInterviewPercentage] = useState(50);
  const [technicalTestPercentage, setTechnicalTestPercentage] = useState(100 - videoInterviewPercentage);  // save in technical test schema
  const [videoDuration, setVideoDuration] = useState(30); // Default duration set to 30 minutes

  // Function to handle moving back to the previous phase
  const moveToPreviousPhase = () => {
    setPhase(phase - 1);
  };
const handleSaveVideoData = async () => {

  if(videoInterviewPercentage < 10 || videoInterviewPercentage > 90){
    setOpenModal(true);
    setMessageTitle('Error');
    setMessage('Video interview percentage should be between 10% and 90%');
    return;
  }
  try {
    const videoData = {
      jobTitle: job.jobTitle,
      jobID: job._id,
      questions: questions.map((q) => q.question),
      duration: videoDuration,
      acceptabilityTraits: Object.entries(traits).map(([trait, weight]) => ({ trait, weight })),
      importance: videoInterviewPercentage,
    };

   
    const response = await axios.post('http://localhost:8000/nisa/api/save-video', videoData);
    setOpenModal(true);
    setMessageTitle('Form Saved');
    setMessage('Video interview data saved successfully!');

    
  } catch (error) {
    console.error('Error saving video data:', error);
    // Handle errors
  }
};

const handleVideoDurationChange = (event) => {
    const duration = event.target.value;
    if(duration > 10){
    setVideoDuration(duration);
    }
    else{
      setOpenModal(true);
      setMessageTitle('Error');
      setMessage('Duration should be greater than 10 minutes');
    }
};
  const handlePercentageChange = (event, type) => {
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value >= 10 && value <= 90) {
          if (type === 'videoInterview') {
              setVideoInterviewPercentage(value);
              setTechnicalTestPercentage(100 - value);
          }
          
      }
      
  };

  const [traits, setTraits] = useState({
    Focused: 1,
    EngagingTone: 1,
    Excited: 1,
    SpeakingRate: 1,
    Calm: 1,
    StructuredAnswers: 1,
    Paused: 1,
    NoFillers: 1,
    Friendly: 1,
    
});


const handleTraitChange = (event, traitName) => {
    const value = parseInt(event.target.value); 
    setTraits({ ...traits, [traitName]: value }); 
};

  
  const handleDeadlineChange = (event) => {
    const selectedDate = event.target.value;
    setFormDeadline(selectedDate);
  };

  useEffect(() => {
      if (props.job){
          setJob(props.job);
      }
  }, [props.job]);

  const handleQuestionTextChange = (index,ev) =>{
      var text = ev.target.value;
      var copy = [...questions];
      copy[index].question = text;
      setQuestions(copy);
  }

  const handleSetForm = (formlink) => {
      navigate('phase2email', { state: { job: job,formLink:formlink,deadline:formDeadline } });
    };

    const Phase2 = () => {

        
        setPhase(3);   
      
      
     
    };

  
  const deleteQuestion=(index)=>{
      var copy = [...questions];
      copy.splice(index, 1);
      setQuestions(copy);
  }

  const addQuestion=(ev)=>{
      var text = ev.target.value;
      var copy = [...questions];
      copy.push({'question': text, options: ['']});
      setQuestions(copy);
  }
  const setOpenModalState = (value) => {
    setOpenModal(value);
  };

  const formatDate = (date) => {
      if (!date) return '';
      const formattedDate = new Date(date); 
      const year = formattedDate.getFullYear();
      const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${formattedDate.getDate()}`.padStart(2, '0');
      return `${day}/${month}/${year}`;
  };

  const Phase1 = () => {
    var flag = true;
    var copy = [...questions];

    if (copy.length < 1) {
        flag = false;
        setMessage("Please enter at least 1 question!");
        setMessageTitle('Error');
        setOpenModal(true);
        return;
    }
    if (copy.length < 3 || copy.length > 5) {
        flag = false;
        setMessage("For a 5-minute interview, it is recommended to set between 3 to 5 questions only.");
        setMessageTitle('Error');
        setOpenModal(true);
        return;
    }
    for (var i = 0; i < copy.length; i++) {
        if (!copy[i].question || copy[i].question.trim() === '') {
            flag = false;
            setMessage("Please fill all fields!");
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }
    }

 
  
  if (videoDuration < 10) {
    
        setOpenModal(true);
        setMessageTitle('Error');
        setMessage('Duration should be greater than 10 minutes');
        return;
  
  }

    setPhase(2);
};


  return (
    <div className='kcreateform-container'>
       
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
            onChange={(e) => setVideoDuration(e.target.value)}
            className='n-vd-dur'
        />
    </div>
   
    <button className='n-nab-createformpage-cancelbtn' onClick={() => navigate(-1, { state: { 'jobID': job._id } })}>Discard</button>
    <button className='kcreateformpage-savebtn' onClick={Phase1}>Next</button>
</div>

         <div className='n-kcreateform-questions'>
             {questions.map((form, index) => (
                 <div key={form.id}>
                     <div className='nkformquestion-con' tabIndex="0">
                         <div className='kformquestion-header'>
                             <label className='kformquestion-header-label'>
                                 <b>Question</b>
                                 <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                             </label>
                             <textarea
                                 className='kformquestion-textbox'
                                 value={form.question}
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
         </div>
         <div className='nnkcreateformpage-addq-con'>
             <button className='nkcreateformpage-addq' onClick={(event) => addQuestion(event)}>+</button>
         </div>
         <MessageModal
             isOpen={openModal}
             message={message}
             title={messageTitle}
             closeModal={() => {
                 setOpenModal(false);
                 if (messageTitle === 'Form Saved') {
                     navigate(-1, { state: { 'jobID': job._id } });
                 }
             }}
            
         />

        
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
        <p className='n-trait-p'>Rate the following personality traits from 1 to 5, where 1 is the lowest and 5 is the highest.</p>
<div className="n-personality-traits">
    <div className="trait-item">
        <label>{Object.keys(traits)[0]}:</label>
        <select value={traits.Focused} onChange={(e) => handleTraitChange(e, 'Focused')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[1]}:</label>
        <select value={traits.EngagingTone} onChange={(e) => handleTraitChange(e, 'EngagingTone')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[2]}:</label>
        <select value={traits.Excited} onChange={(e) => handleTraitChange(e, 'Excited')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[3]}:</label>
        <select value={traits.SpeakingRate} onChange={(e) => handleTraitChange(e, 'SpeakingRate')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[4]}:</label>
        <select value={traits.Calm} onChange={(e) => handleTraitChange(e, 'Calm')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[5]}:</label>
        <select value={traits.StructuredAnswers} onChange={(e) => handleTraitChange(e, 'StructuredAnswers')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[6]}:</label>
        <select value={traits.Paused} onChange={(e) => handleTraitChange(e, 'Paused')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[7]}:</label>
        <select value={traits.NoFillers} onChange={(e) => handleTraitChange(e, 'NoFillers')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
    <div className="trait-item">
        <label>{Object.keys(traits)[8]}:</label>
        <select value={traits.Friendly} onChange={(e) => handleTraitChange(e, 'Friendly')}>
            {[...Array(5)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
            ))}
        </select>
    </div>
   
</div>
<button className='n2-nab-createformpage-cancelbtn' onClick={moveToPreviousPhase}>Back</button>
<button className="nisa-createformpage-savebtn" onClick={Phase2}>Next</button>
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
                value={videoInterviewPercentage}
                onChange={(e) => handlePercentageChange(e, 'videoInterview')}
            />
            <span>%</span>
        </div>
        <div className="percentage-item">
            <label>Technical Test:</label>
            <input
                type="number"
                value={100 - videoInterviewPercentage}
                disabled
            />
            <span>%</span>
        </div>
    </div>
    <button className='n2-nab-createformpage-cancelbtn' onClick={moveToPreviousPhase}>Back</button>
    <button className='nisa-createformpage-savebtn' onClick={handleSaveVideoData}>Save</button>
</div>
<MessageModal
             isOpen={openModal}
             message={message}
             title={messageTitle}
             closeModal={() => {
                 setOpenModal(false);
                 if (messageTitle === 'Form Saved') {
                     navigate(-1, { state: { 'jobID': job._id } });
                 }
             }}
            
         />

    </div>
    )}
  </div>
    );
  }
