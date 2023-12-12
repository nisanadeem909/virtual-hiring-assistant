import { useNavigate } from 'react-router-dom';
import './formresponses.css'

import React, { useEffect, useState } from 'react' 

import Footer from '../Footer'

export default function ShortlistedFormResponsesPage() {
    
    const [responses,setResponses] = useState([{'name':'Komal Waseem','email':'komalwaseem@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST','status':'Shortlisted'},{'name':'Nabeeha Mudassir','email':'nabeehaa@gmail.com','status':'Shortlisted','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST','status':'Rejected'},{'name':'Nisa Nadeem','email':'nisanadeem@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST','status':'Shortlisted'},{'name':'Hania Waseem','email':'haniawaseem@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST','status':'Rejected'},{'name':'Komal Waseem','email':'komalwaseemm@gmail.com','ans1':'No','ans2':'Less than 2 years','ans3':'No','ans4':'NUST','status':'Shortlisted'}])
    const [job,setJob] = useState({'jobTitle':'Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})
    
    const [questions,setQuestions] = useState(['Have you graduated yet?','How many years of Experience with ReactJS?',"Can you relocate to Lahore?","Where did you graduate from?"])
    
    const [numberShortlisted,setNumberShortlisted] = useState('None')
    

    const setShortlisted=()=>{
        const shortlistedCount = responses.filter(app => app.status === 'Shortlisted').length;
        setNumberShortlisted(shortlistedCount)

        setResponses(responses => [...responses].sort((a, b) => {
            if (a.status === 'Shortlisted' && b.status !== 'Shortlisted') {
              return -1;
            } else if (a.status !== 'Shortlisted' && b.status === 'Shortlisted') {
              return 1;
            } else {
              return 0;
            }
          }));

        console.log(responses)
        
    }
    useEffect(() => {
         
        /*Over here props will be used to set the Questions in setQuestions */
        /*Over here props will be used to set the Responses in setResponses */
        

        /* Only append Status once, not every time the state changes */
        // const newQuestion = 'Status';
        // if (!questions.includes === "Status")
        //     setQuestions([...questions, newQuestion]);

        setShortlisted();

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
             <div className='kcvcollectionpage-header-vr'></div>
             <div className='kcvcollectionpage-accScore-div'>
                 <label className='kcvcollectionpage-accScore'>{numberShortlisted}</label>
                 <label className='kcvcollectionpage-accScore-title'>Shortlisted Responses</label>
             </div>
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
                     <th align="center">Status</th>
                     
                 </tr>
             </thead>
             <tbody className='kcvcollectionpage-table-body'>
                 {responses.map((app,index)=>(
                     <tr
                        key={index}  // Add a unique key to each row for React to efficiently track changes
                        className={`kcvcollectionpage-table-row ${app.status === 'Shortlisted' ? 'shortlisted' : 'not-shortlisted'}`}
                        >
                         <td align="center">{index+1}</td>
                         <td align="center">{app.name}</td>
                         <td align="center">{app.email}</td>
                         <td align="center">{app.ans1}</td>
                         <td align="center">{app.ans2}</td>
                         <td align="center">{app.ans3}</td>
                         <td align="center">{app.ans4}</td>

                         <td align="center"><b>{app.status}</b></td>
                         
                         
                         {/* <td align="center"><button className='kcvcollectionpage-table-cvbtn'>View CV<img src={cvImg} className='kcvcollectionpage-table-cvimg'></img></button></td> */}
                     </tr>
                 ))}
             </tbody>
         </table>
         </div>
       </div>
     )
   }