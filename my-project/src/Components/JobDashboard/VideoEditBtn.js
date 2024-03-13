import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function VideoEditBtn(props) {

  const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
  
  useEffect(() => {
      if (props.job)
          setJob(props.job);
      }, [props.job]);
    
    const navigate = useNavigate();

    return (
      <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>
            <label className='kp2formcreating-header-title'>Edit Video Test for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={()=>navigate('\editvideo',{state:{'job':job}})}>Edit Video Test</button>
          
        </div>
      </div>
    )
  }