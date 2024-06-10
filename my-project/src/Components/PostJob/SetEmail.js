import React from 'react'
import { useNavigate } from 'react-router-dom';
import './PostJobPage.css'
import { useLocation } from 'react-router-dom';

export default function SetEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const jobID = location.state.savedJobId;


    const handleSetRejectionEmail = () => {  
       
        navigate('rejectionemail', { state: { jobID } });
      };
    
      const handleSetForm = () => {
        navigate('phase2email', { state: { jobID } });
      };
    


  return (
    <div>
        <div className='post-job-container'>
         <h1 className='nisa-setemail-h'>Almost There!</h1> 
         <h3 className='nisa-phase1-h'>Now set rejection email and Form link email</h3>  
        <button className='nisa-postJ-button2' onClick={handleSetRejectionEmail}>
                  Set Rejection Email
                </button>
                <button className='nisa-postJ-button3' onClick={handleSetForm}>
                  Set Form Link Email
        </button>
        </div>
    </div>
  )
}
