import React from 'react' 
import './formcollectionemail.css';
import Footer from '../Footer'
import FormCollectionEmail from './FormCollectionEmailComponent'

export default function RejectionEmailPage() {

    return (
      <div className='krejemailpage-con'>
          <div className='krejemailpage-main'>
            <FormCollectionEmail/>
          </div>
          <div className='krejemailpage-footer'>
            <Footer/>
          </div>

      </div>
    )
  }