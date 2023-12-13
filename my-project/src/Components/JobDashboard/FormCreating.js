import React, { useState } from 'react' 
import './JobDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function FormCreating() {

   const [job,setJob] = useState({'jobTitle':'Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})
   const navigate = useNavigate();

    return (
      <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>
            <label className='kp2formcreating-header-title'>Create Form for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={()=>navigate('\createform')}>Create Phase 2 Form</button>
            <button className='kp2formcreating-skipbtn'>Skip Form Screening</button>
        </div>
      </div>
    )
  }