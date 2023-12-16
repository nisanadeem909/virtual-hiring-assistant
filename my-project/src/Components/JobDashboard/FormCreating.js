import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function FormCreating(props) {

  const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
  
  useEffect(() => {
      if (props.job)
          setJob(props.job);
      }, [props.job]);
    
    const navigate = useNavigate();

    return (
      <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>
            <label className='kp2formcreating-header-title'>Create Form for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={()=>navigate('\createform',{state:{'job':job}})}>Create Phase 2 Form</button>
            {/*<button className='kp2formcreating-skipbtn'>Skip Form Screening</button>*/}
        </div>
      </div>
    )
  }