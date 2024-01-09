import React, { useEffect, useState } from 'react' 
import './NotificationPage.css';
import CVNotif from '../images/CVnotif.png';
import FormNotif from '../images/FormNotif.png';
import VideoNotif from '../images/VideoNotif.png';
import ShortlistNotif from '../images/ShortlistNotif.jpg';
import loading from '../images/loading3.gif';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NotificationPage() {

    const [notifications,setNotifs] = useState(<img src={loading} className='knotif-loading-img'></img>);

    const notifImg = [CVNotif, FormNotif, VideoNotif, ShortlistNotif];

    const navigate = useNavigate();

    const convertDate = (mongoDate) => {
        const currentDateTime = new Date();
        const previousDateTime = new Date(mongoDate);
        //alert(previousDateTime);
      
        const timeDifference = currentDateTime.getTime() - previousDateTime.getTime();
      
        const secondsDifference = Math.floor(timeDifference / 1000);
      
        if (secondsDifference < 60) {
          return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
        }
      
        const minutesDifference = Math.floor(secondsDifference / 60);
      
        if (minutesDifference < 60) {
          return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
        }
      
        const hoursDifference = Math.floor(minutesDifference / 60);
      
        if (hoursDifference < 24) {
          return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
        }
      
        const daysDifference = Math.floor(hoursDifference / 24);
      
        if (daysDifference < 30) {
          return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
        }
      
        const monthsDifference = Math.floor(daysDifference / 30);
      
        if (monthsDifference < 12) {
          return monthsDifference === 1 ? '1 month ago' : `${monthsDifference} months ago`;
        }
      
        const yearsDifference = Math.floor(monthsDifference / 12);
      
        return yearsDifference === 1 ? '1 year ago' : `${yearsDifference} years ago`;
      };
      

    useEffect(() => {
        const fetchData = () => {
        axios.post("http://localhost:8000/komal/getnotifications").then((response) => {
           // alert(JSON.stringify(response.data));
           if (response.data.status == "success"){
              if (response.data.data.length != 0){
                //alert("hello")
                setNotifs(response.data.data.map((notification)=>(
                    <div className='knotif-notification' onClick={()=>navigate('/recruiter/job', { state: { 'jobID': notification.jobID } })}>
                        <img className="knotif-icon" src={notifImg[notification.notifType-1]}></img>
                        <div className='knotif-content'>
                            <div className='knotif-content-top'>
                                <label className='knotif-jobtitle'><b>Job: {notification.jobTitle}</b></label>
                                <label className='knotif-time'>{convertDate(notification.createdAt)}</label>
                            </div>
                            <label className='knotif-desc'>{notification.notifText}</label>
                        </div>
                    </div>
                )));}
              else 
                setNotifs(<div className='knotif-error-div'>No notifications yet!</div>)
            }
            else 
              setNotifs(<div className='knotif-error-div'>Something went wrong, please try again!</div>)
        })
        .catch(function (error) {
            setNotifs(<div className='knotif-error-div'>Something went wrong, please try again!</div>)
        });
    };

        fetchData(); // Initial fetch
      
        const interval = setInterval(fetchData, 30000); // Update every 30 seconds
      
        return () => clearInterval(interval); // Clear the interval on component unmount
      }, []);

    return (
      <div className='knotif-container'>
      <label className='knotif-pagetitle'>Notifications</label>
      {notifications}
       {/* */}
    </div>
    )
  }