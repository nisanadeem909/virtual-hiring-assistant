import React, { useState } from 'react';
import './CreateFormPage.css';
import Footer from '../Footer';
import CreateForm from './CreateFormNew';

export default function CreateFormPage() {

    const [jobTitle,setJobTitle] = useState("Job Title");

  return (
    <div className='kcreateformpage-con'>
      <div className='kcreateformpage-header'>
        <label className='kcreateformpage-header-title'><b>Create Form for Phase 2</b></label>
        <hr></hr>
        <label className='kcreateformpage-header-job'><b>Job: </b>{jobTitle}</label>
      </div>
      <div className='kcreateformpage-middle'>
        <CreateForm></CreateForm>
      </div>
      <div className='kcreateformpage-footer'>
        <Footer />
      </div>
    </div>
  );
}
