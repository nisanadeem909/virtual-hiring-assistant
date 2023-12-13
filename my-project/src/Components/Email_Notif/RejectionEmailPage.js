import React from 'react' 
import './RejectionEmail.css';
import Footer from '../Footer'
import RejectionEmail from './RejectionEmail'

export default function RejectionEmailPage() {

    return (
      <div className='krejemailpage-con'>
          <div className='krejemailpage-main'>
            <RejectionEmail/>
          </div>
          <div className='krejemailpage-footer'>
            <Footer/>
          </div>

      </div>
    )
  }