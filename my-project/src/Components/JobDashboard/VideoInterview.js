import React, { useEffect, useState } from 'react' 
import './CVScreening.css';
import Footer from '../Footer'
import cvImg from '../images/cvbtn.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VideoInterview(props) {

    const [job,setJob] = useState('Loading...')

    const navigate = useNavigate()
    useEffect(() => {
        
        if (props.job)
            setJob(props.job);

    }, [props.job]);
      
    return(
        <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>
            <label className='kp2formcreating-header-title'>Set Video Interview Questions for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={()=>navigate('/recruiter/job/videointerviewquestionpage',{state:{'job':job}})}>Set Questionnaire</button>
            {/*<button className='kp2formcreating-skipbtn'>Skip Form Screening</button>*/}
        </div>
      </div>
)
}