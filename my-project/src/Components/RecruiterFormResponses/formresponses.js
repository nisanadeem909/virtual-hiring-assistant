import { useNavigate } from 'react-router-dom';
import './formresponses.css'

import React, { useEffect, useState } from 'react' 

import Footer from '../Footer'

export default function FormResponsesPage() {
    
    const [responses,setResponses] = useState([{'name':'Komal Waseem','email':'komalwaseem@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST'},{'name':'Nabeeha Mudassir','email':'nabeehaa@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST'},{'name':'Nisa Nadeem','email':'nisanadeem@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST'},{'name':'Hania Waseem','email':'haniawaseem@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST','ans5':'I love to work in a fast-paced organisation'},{'name':'Komal Waseem','email':'komalwaseemm@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST'}])
    const [job,setJob] = useState({'jobTitle':'Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})
    
    const [questions,setQuestions] = useState(['Have you graduated yet?','How many years of Experience with ReactJS?',"Can you relocate to Lahore?","Where did you graduate from?"])
    

    useEffect(() => {
         
        /*Over here props will be used to set the Questions in setQuestions */
        /*Over here props will be used to set the Responses in setResponses */

     }, []);
 
     return (
       <div className='kcvcollectionpage-con'>
         <div className='kcvcollectionpage-header'>
             <label className='kcvcollectionpage-header-title'>Form Responses for {job.jobTitle}</label>
             <div className='kcvcollectionpage-header-vr'></div>
             <div className='kcvcollectionpage-deadline-div'>
                 <label className='kcvcollectionpage-deadline'>{responses.length}</label>
                 <label className='kcvcollectionpage-deadline-title'>Received Responses</label>
             </div>
             {/* <div className='kcvcollectionpage-header-vr'></div>
             <div className='kcvcollectionpage-accScore-div'>
                 <label className='kcvcollectionpage-accScore'>{job.acceptableCVScore}%</label>
                 <label className='kcvcollectionpage-accScore-title'>Acceptable Match Score</label>
             </div> */}
         </div>
         <div className='kcvcollectionpage-inner'>
         <table className='kcvcollectionpage-table'>
             <thead className='kcvcollectionpage-table-header'>
                 <tr className='kcvcollectionpage-table-header-row'>
                     <th align="center">#</th>
                     <th align="center">Name</th>
                     <th align="center">Email</th>

                    {questions.map((quest,index)=>(
                        <th align="center">{quest}</th>
                    ))}
                     
                     
                 </tr>
             </thead>
             <tbody className='kcvcollectionpage-table-body'>
                 {responses.map((app,index)=>(
                     <tr className='kcvcollectionpage-table-row'>
                         <td align="center">{index+1}</td>
                         <td align="center">{app.name}</td>
                         <td align="center">{app.email}</td>
                         <td align="center">{app.ans1}</td>
                         <td align="center">{app.ans2}</td>
                         <td align="center">{app.ans3}</td>
                         <td align="center">{app.ans4}</td>
                         
                         {/* <td align="center"><button className='kcvcollectionpage-table-cvbtn'>View CV<img src={cvImg} className='kcvcollectionpage-table-cvimg'></img></button></td> */}
                     </tr>
                 ))}
             </tbody>
         </table>
         </div>
       </div>
     )
   }