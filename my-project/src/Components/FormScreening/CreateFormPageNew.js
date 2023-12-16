import React, { useEffect, useState } from 'react';
import './CreateFormPage.css';
import Footer from '../Footer';
import CreateForm from './CreateFormNew';
import { useLocation } from 'react-router-dom';

export default function CreateFormPage(props) {
  
  const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
  
  const location = useLocation();
  const stateData = location.state;

  useEffect(() => {
    if (stateData)
      setJob(stateData.job);
   // alert(JSON.stringify(stateData))
    }, []);

  return (
    <div className='kcreateformpage-con'>
      <div className='kcreateformpage-header'>
        <label className='kcreateformpage-header-title'><b>Create Form for Phase 2</b></label>
        <hr></hr>
        <label className='kcreateformpage-header-job'><b>Job: </b>{job.jobTitle}</label>
      </div>
      <div className='kcreateformpage-middle'>
        <CreateForm job={job}></CreateForm>
      </div>
      <div className='kcreateformpage-footer'>
        <Footer />
      </div>
    </div>
  );
}
