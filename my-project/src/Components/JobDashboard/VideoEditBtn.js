import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function VideoEditBtn({job}) {

    const [currjob, setCurrentJob] = useState({
        'jobTitle': 'Loading..',
        'CVFormLink': 'Loading..',
        'AccCVScore': { $numberDecimal: '0' },
        'CVDeadline': 'dd/mm/yyyy',
        'status': '0',
        'jobDescription': 'Loading..'
      });
    
      useEffect(() => {
        //alert(job.jobTitle);
        
          setCurrentJob(job);
        
      }, [job]);
    const navigate = useNavigate();

    return (
      <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>
            <label className='kp2formcreating-header-title'>Edit Video Questionnaire for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={()=>navigate('\editvideo',{state:{'job':currjob}})}>Edit Video Questionnaire</button>
          
        </div>
      </div>
    )
  }