import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import Footer from '../Footer'

export default function JobDetails(props) {

    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [jobStatus,setStatus] = useState("Loading..");

    useEffect(() => {
        if (props.job)
            setJob(props.job);
      }, [props.job]);

    useEffect(() => {
        //alert(job.status)
          if (job.status == 0)
            setStatus("Loading..")
          else if (job.status == 1)
              setStatus("Phase 1 (CV Screening)")
          else if (job.status == 2)
            setStatus("Phase 2 (Form Screening)")
          else if (job.status == 3)
            setStatus("Phase 3 (Video-Interview)")
          else if (job.status == 4)
            setStatus("Phase 4 (Technical Test)")
          else if (job.status == 5)
            setStatus("Shortlisted")
        }, [job.status]);

    return (
      <div className='kjobdetailspage-con'>
        <div className='kjobdetailspage-header'>
            <label className='kjobdetailspage-jobtitle'>{job.jobTitle} Job Details</label>
            <label className='kjobdetailspage-jobstatus'>Current status: {jobStatus}</label>
        </div>
        <div className='kjobdetailspage-inner'>
            <div className='kjobdetailspage-deadline-div'>
                <label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {new Date(job.CVDeadline).toLocaleDateString('en-GB')}</label>
                <button className='kjobdetailspage-editdeadline'>Edit Deadline</button>
            </div>
            <div className='kjobdetailspage-cv-div'>
                <label className='kjobdetailspage-cvlink'><b>CV collection form link:</b> {job.CVFormLink}</label>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {job.AccCVScore.$numberDecimal.toString()}%</label>
                <button className='kjobdetailspage-editcvscore'>Edit Acceptable Score</button>
            </div>
            <div className='kjobdetailspage-jd-div'>
                <label className='kjobdetailspage-jd-title'>Job Description</label>
                <hr className='kjobdetailspage-jd-hr'></hr>
                <p className='kjobdetailspage-jd'>{job.jobDescription}</p>
            </div>
        </div>
      </div>
    )
  }