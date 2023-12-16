import React from 'react' 
import './RejectionEmail.css';
import Footer from '../Footer'
import RejectionEmail from './RejectionEmail'
import { useLocation } from 'react-router-dom';

export default function RejectionEmailPage() {

  const location = useLocation();
  const jobID = location.state.jobID;

    return (
      <div className='krejemailpage-con'>
          <div className='krejemailpage-main'>
            <RejectionEmail data={jobID}/>
          </div>
          <div className='krejemailpage-footer'>
            <Footer/>
          </div>

      </div>
    )
  }