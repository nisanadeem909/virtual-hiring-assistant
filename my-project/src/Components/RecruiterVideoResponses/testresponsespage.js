import { useNavigate } from 'react-router-dom';
import './videoresponsepage.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react' 

import Footer from '../Footer'

export default function FormResponsesPage(props) {
    
    const [job,setJob] = useState({'jobTitle':'Dummy Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})
    const [jobTitle,setJobTitle] = useState()
    
    const [resps,setResps] = useState([])
    const navigate = useNavigate();
    const getFormResponses = () =>
    {
        var param = {'jobId':props.job._id};
        axios.post("http://localhost:8000/nabeeha/fetchtestresponsesnabeeha",param).then((response) => {
          
        //alert(response.data.formResponses)
        
        setResps(response.data.responses);
       
       
        })
        .catch(function (error) {
            //alert("Axios Error:" + error);
        });
    }
    useEffect(() => {
         
        setJobTitle(props.job.jobTitle)
        getFormResponses()
        
     }, []);
     
     const displayTest =(email)=>
     {
     
        let thisjob = props.job;
        // alert(thisjob._id)
        navigate('/recruiter/job/ttest', { state: { thisjob,email:email}});
     }

     return (
      <div className='kcvcollectionpage-con'>
        <div className='kcvcollectionpage-header'>
          <label className='kcvcollectionpage-header-title'>Test Responses for {jobTitle}</label>
          <div className='kcvcollectionpage-header-vr'></div>
          <div className='kcvcollectionpage-deadline-div'>
            <label className='kcvcollectionpage-deadline'>{resps.length}</label> 
            <label className='kcvcollectionpage-deadline-title'>Received Responses</label>
          </div>
        </div>
        <div className='kcvcollectionpage-inner'>
          {resps.length === 0 ? (
            <>
            <br></br>
            <p style={{ fontSize: 18 }}>No Responses yet.</p>

            </>
          ) : (
            <>
            <br></br>
            <div className='nabcvcollectionpage-table-container'>
              <table className='nabcvcollectionpage-table'>
              <thead className='kcvcollectionpage-table-header'>
                        <tr className='nabcvcollectionpage-table-header-row'>
                        <th align="center">#</th>
                        <th align="center">Email</th>
                        
                        <th align="center">Aggregate Score</th>
                        
                        <th align="center">Test </th>
                        </tr>
                </thead>
                <tbody>
                        {resps.map((resp, index) => (
                        <tr  key={index}>
                            <td align="center">{index + 1}</td>
                            <td align="center">{resp.applicantEmail}</td>
                            
                            <td align="center">{resp.overallScore}</td> {/*replace with resp.overallScore*/}
                            <td align="center">
                            
                            {/* <a href={`http://localhost:8000/routes/profilepictures/${resp.videoPath}`}>Watch Video</a> */}
                           
                            <a
                           href={`/recruiter/job/ttest/${resp.applicantEmail}`}
                            onClick={(e) => {
                              e.preventDefault();
                             displayTest(resp.applicantEmail);
                            }}>
                            View Test 
                            </a>
                            
                            

                            </td>
                        </tr>
                        ))}
                </tbody>
                  
                </table>
                
              </div>
              </>    
          )}
          
        </div>
        
      </div>
      
    );
                    }