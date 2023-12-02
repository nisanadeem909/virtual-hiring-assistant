import React from 'react' 
import './NotificationPage.css';
import CVNotif from '../images/CVnotif.png';
import FormNotif from '../images/FormNotif.png';
import VideoNotif from '../images/VideoNotif.png';
import ShortlistNotif from '../images/ShortlistNotif.jpg';

export default function NotificationPage() {

    return (
      <div className='knotif-container'>
      <label className='knotif-pagetitle'>Notifications</label>
        <div className='knotif-notification'>
            <img className="knotif-icon" src={CVNotif}></img>
            <div className='knotif-content'>
                <div className='knotif-content-top'>
                    <label className='knotif-jobtitle'><b>Job: Graphic Designer</b></label>
                    <label className='knotif-time'>5 minutes ago</label>
                </div>
                <label className='knotif-desc'>CVs have been shortlisted!</label>
            </div>
        </div>

        <div className='knotif-notification'>
            <img className="knotif-icon" src={FormNotif}></img>
            <div className='knotif-content'>
                <div className='knotif-content-top'>
                    <label className='knotif-jobtitle'><b>Job: Web Developer</b></label>
                    <label className='knotif-time'>3 hours ago</label>
                </div>
                <label className='knotif-desc'>Reminder: Waiting for form creation to proceed to phase 2.</label>
            </div>
        </div>

    <div className='knotif-notification'>
        <img className="knotif-icon" src={VideoNotif}></img>
        <div className='knotif-content'>
            <div className='knotif-content-top'>
                <label className='knotif-jobtitle'><b>Job: HR Manager</b></label>
                <label className='knotif-time'>6 hours ago</label>
            </div>
            <label className='knotif-desc'>Reminder: Please set time-slots for video interviews.</label>
        </div>
    </div>

    <div className='knotif-notification'>
        <img className="knotif-icon" src={ShortlistNotif}></img>
        <div className='knotif-content'>
            <div className='knotif-content-top'>
                <label className='knotif-jobtitle'><b>Job: IOS Developer</b></label>
                <label className='knotif-time'>3 days ago</label>
            </div>
            <label className='knotif-desc'>Candidates have been shortlisted for the job.</label>
        </div>
    </div>
    </div>
    )
  }