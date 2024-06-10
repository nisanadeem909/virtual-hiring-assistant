import React from 'react';
import { useLocation } from 'react-router-dom';
import './CVView.css';
import Footer from '../Footer';

export default function CVView() {
  const location = useLocation();
  const propsData = location.state;

  return (
    <div className='cv-view-concon'>
      <div className='cv-view-header'>
        <label className='cv-view-header-title'>View Job Applicant CV</label>
        <div className='cv-view-header-div'>
          <label className='cv-view-header-lbl'>{propsData.name}</label>
          <label className='cv-view-header-lbl'>{propsData.email}</label>
        </div>
      </div>
      <div className='cv-view-container'>
        <iframe
          src={`http://localhost:8000/routes/resumes/${propsData.CVPath}`}
          title='CV Document'
          className='cv-view-cv'
        />
      </div>
      <Footer />
    </div>
  );
}
