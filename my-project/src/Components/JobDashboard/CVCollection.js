import React, { useEffect, useState } from 'react' 
import './CVScreening.css';
import Footer from '../Footer'
import cvImg from '../images/cvbtn.png'

export default function CVCollection(props) {

   const [applications,setApps] = useState([{'name':'Komal Waseem','email':'komalwaseem@gmail.com','date':'01/12/2023'},{'name':'Nabeeha Mudassir','email':'nabeehaa@gmail.com','date':'02/12/2023'},{'name':'Nisa Nadeem','email':'nisanadeem@gmail.com','date':'05/12/2023'},{'name':'Hania Waseem','email':'haniawaseem@gmail.com','date':'09/12/2023'},{'name':'Komal Waseem','email':'komalwaseemm@gmail.com','date':'11/12/2023'}])
   const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
   
   useEffect(() => {
    if (props.job)
        setJob(props.job);
    }, [props.job]);

    return (
      <div className='kcvcollectionpage-con'>
        <div className='kcvcollectionpage-header'>
            <label className='kcvcollectionpage-header-title'>Applications for {job.jobTitle}</label>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-deadline-div'>
                <label className='kcvcollectionpage-deadline'>{new Date(job.CVDeadline).toLocaleDateString('en-GB')}</label>
                <label className='kcvcollectionpage-deadline-title'>Deadline</label>
            </div>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-accScore-div'>
                <label className='kcvcollectionpage-accScore'>{job.AccCVScore.$numberDecimal.toString()}%</label>
                <label className='kcvcollectionpage-accScore-title'>Acceptable Match Score</label>
            </div>
        </div>
        <div className='kcvcollectionpage-inner'>
        <table className='kcvcollectionpage-table'>
            <thead className='kcvcollectionpage-table-header'>
                <tr className='kcvcollectionpage-table-header-row'>
                    <th align="center">#</th>
                    <th align="center">Name</th>
                    <th align="center">Email</th>
                    <th align="center">Application Date</th>
                    <th align="center">CV</th>
                </tr>
            </thead>
            <tbody className='kcvcollectionpage-table-body'>
                {applications.map((app,index)=>(
                    <tr className='kcvcollectionpage-table-row'>
                        <td align="center">{index+1}</td>
                        <td align="center">{app.name}</td>
                        <td align="center">{app.email}</td>
                        <td align="center">{app.date}</td>
                        <td align="center"><button className='kcvcollectionpage-table-cvbtn'>View CV<img src={cvImg} className='kcvcollectionpage-table-cvimg'></img></button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
      </div>
    )
  }