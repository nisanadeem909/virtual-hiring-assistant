import React, { useEffect, useState } from 'react' 
import './CVScreening.css';
import Footer from '../Footer'
import cvImg from '../images/cvbtn.png'

export default function CVScreening() {

   const [applications,setApps] = useState([{'name':'Komal Waseem','email':'komalwaseem@gmail.com','date':'01/12/2023','score':'80'},{'name':'Nabeeha Mudassir','email':'nabeehaa@gmail.com','date':'02/12/2023','score':'75'},{'name':'Nisa Nadeem','email':'nisanadeem@gmail.com','date':'05/12/2023','score':'90'},{'name':'Hania Waseem','email':'haniawaseem@gmail.com','date':'09/12/2023','score':'30'},{'name':'Komal Waseem','email':'komalwaseemm@gmail.com','date':'11/12/2023','score':'60'}])
   const [job,setJob] = useState({'jobTitle':'Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})

   useEffect(() => {
        const sortedApplications = [...applications];
        sortedApplications.sort((a, b) => b.score - a.score);
        setApps(sortedApplications);
    }, []);

    return (
      <div className='kcvcollectionpage-con'>
        <div className='kcvcollectionpage-header'>
            <label className='kcvcollectionpage-header-title'>Screened Applications for {job.jobTitle}</label>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-deadline-div'>
                <label className='kcvcollectionpage-deadline'>{applications.length}</label>
                <label className='kcvcollectionpage-deadline-title'>Total Applications</label>
            </div>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-accScore-div'>
                <label className='kcvcollectionpage-accScore'>{job.acceptableCVScore}%</label>
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
                    <th align="center">CV-JD Match Score</th>
                    <th align="center">Application Date</th>
                    <th align="center">CV</th>
                </tr>
            </thead>
            <tbody className='kcvcollectionpage-table-body'>
                {applications.map((app,index)=>(
                    <tr className='kcvcollectionpage-table-row' style={{ backgroundColor: app.score > job.acceptableCVScore ? '#b3e882' : '#ff6459' }}>
                        <td align="center">{index+1}</td>
                        <td align="center">{app.name}</td>
                        <td align="center">{app.email}</td>
                        <td align="center"><b>{app.score}</b>%</td>
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