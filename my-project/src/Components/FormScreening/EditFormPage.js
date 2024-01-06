import React, { useEffect, useState } from 'react';
import './CreateFormPage.css';
import Footer from '../Footer';
import EditForm from './EditForm';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function EditFormPage(props) {
  
  const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
  const [form,setForm] = useState({'questions':[],'formDeadline':'Loading..','jobTitle':'Loading..'})
  
  const location = useLocation();
  const stateData = location.state;

  useEffect(() => {
    if (stateData)
    {
      setJob(stateData.job);
      var param = {'job':stateData.job._id};
            axios.post("http://localhost:8000/komal/getjobform",param).then((response) => {
            // alert(JSON.stringify(response.data));
            if (response.data.status == "success"){
                setForm(response.data.form)
            }
            else {
                alert("not found")
            }
            })
            .catch(function (error) {
                alert("Axios Error:" + error);
            });
    }
   // alert(JSON.stringify(stateData))
    }, []);

  return (
    <div className='kcreateformpage-con'>
      <div className='kcreateformpage-header'>
        <label className='kcreateformpage-header-title'><b>Edit Form for Phase 2</b></label>
        <hr></hr>
        <label className='kcreateformpage-header-job'><b>Job: </b>{job.jobTitle}</label>
      </div>
      <div className='kcreateformpage-middle'>
        <EditForm job={job} form={form}></EditForm>
      </div>
      <div className='kcreateformpage-footer'>
        <Footer />
      </div>
    </div>
  );
}
