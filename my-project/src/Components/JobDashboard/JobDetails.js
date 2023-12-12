import React, { useState } from 'react' 
import './JobDashboard.css';
import Footer from '../Footer'

export default function JobDetails() {

    const [job,setJob] = useState({'jobTitle':'Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})

    return (
      <div className='kjobdetailspage-con'>
        <div className='kjobdetailspage-header'>
            <label className='kjobdetailspage-jobtitle'>{job.jobTitle} Job Details</label>
            <label className='kjobdetailspage-jobstatus'>Current status: {job.status}</label>
        </div>
        <div className='kjobdetailspage-inner'>
            <div className='kjobdetailspage-deadline-div'>
                <label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {job.appDeadline}</label>
                <button className='kjobdetailspage-editdeadline'>Edit Deadline</button>
            </div>
            <div className='kjobdetailspage-cv-div'>
                <label className='kjobdetailspage-cvlink'><b>CV collection form link:</b> {job.CVFormLink}</label>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {job.acceptableCVScore}%</label>
                <button className='kjobdetailspage-editcvscore'>Edit Acceptable Score</button>
            </div>
            <div className='kjobdetailspage-jd-div'>
                <label className='kjobdetailspage-jd-title'>Job Description</label>
                <hr className='kjobdetailspage-jd-hr'></hr>
                <p className='kjobdetailspage-jd'>{job.jobDesc}</p>
            </div>
        </div>
      </div>
    )
  }