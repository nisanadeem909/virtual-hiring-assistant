import React from 'react' 
import './NotificationPage.css';
import Footer from '../Footer'
import Notification from './Notification'

export default function NotificationPage() {

    return (
      <div className='knotifpage-con'>
          <div className='knotifpage-main'>
            <Notification/>
          </div>
          <div className='knotifpage-footer'>
            <Footer/>
          </div>

      </div>
    )
  }