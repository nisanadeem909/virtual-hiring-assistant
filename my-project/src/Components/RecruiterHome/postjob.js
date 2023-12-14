import React from 'react'
import './postjob.css';
import img from './postjob2.png';

export default function postjob() {
  return (
    <div>
        <div className='nisa-postjob-con'>
        <img className='nisa-postjob-img' src={img}></img>
            <h3 className='nisa-postjob-head'>Post a New Job</h3>
            <button className='nisa-postjob-btn'>Post Job</button>
        </div>
      
    </div>
  )
}
