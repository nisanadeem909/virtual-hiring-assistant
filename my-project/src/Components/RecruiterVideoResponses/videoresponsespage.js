import { useNavigate } from 'react-router-dom';
import './videoresponsepage.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react' 
import cvImg from '../images/cvbtn.png'
import Footer from '../Footer'

export default function FormResponsesPage(props) {
    
    const [job,setJob] = useState({'jobTitle':'Dummy Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})
    const [jobTitle,setJobTitle] = useState()
    
    const [resps,setResps] = useState([])
    const navigate = useNavigate();
    const getFormResponses = () =>
    {
        var param = {'jobId':props.job._id};
        axios.post("http://localhost:8000/nabeeha/fetchvideoresponses",param).then((response) => {
          
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
     
     const handleWatchVideo = (videoUrl, applicantInfo, traitScores) => {
      // Navigate to the VideoPage component passing necessary data

      /**traitScores: [
        { name: 'Excited', score: 8 },
        { name: 'Confident', score: 5 },
        { name: 'Engaging Tone', score: 4 },
        { name: 'Focused', score: 10 },
        { name: 'Speaking Rate', score: 1 },
        { name: 'Calm', score: 9 },
        { name: 'Structured Answers', score: 8 },
        { name: 'Paused', score: 3 },
        { name: 'NoFillers', score: 7 }
        
      ] */
      
      navigate('/recruiter/job/video', { state: { videoUrl, applicantInfo,  traitScores: traitScores} });
    };
     return (
      <div className='kcvcollectionpage-con'>
        <div className='kcvcollectionpage-header'>
          <label className='kcvcollectionpage-header-title'>Video Interview Responses for {jobTitle}</label>
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
                        <th align="center">Status</th>
                        <th align="center">Aggregate Score</th>
                        
                        <th align="center">Video Link</th>
                        </tr>
                </thead>
                <tbody>
                        {resps.map((resp, index) => (
                        <tr  key={index}>
                            <td align="center">{index + 1}</td>
                            <td align="center">{resp.applicantEmail}</td>
                            
                            
                            <td align="center">{resp.status}</td>
                            <td align="center">
                              {resp.status === 'processed' 
                                ? `${resp.overallScore.$numberDecimal}/${resp.acceptabilityTraits.length}`
                                : resp.status === 'missing' 
                                  ? 'N/A'
                                  : 'In process'
                              }
                            </td>
<td align="center">
                            
                            {/* <a href={`http://localhost:8000/routes/profilepictures/${resp.videoPath}`}>Watch Video</a> */}
                            <a
                            className='k-watchvideo-btn'
                            href={`/recruiter/job/video/${resp.applicantEmail}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleWatchVideo(
                                `http://localhost:8000/routes/applicantvideos/`+resp.videoPath,
                                resp.applicantEmail,
                                resp.acceptabilityTraits
                              );
                            }}
                          >
                            Watch Video
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