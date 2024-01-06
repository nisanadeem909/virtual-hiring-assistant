import { useNavigate } from 'react-router-dom';
import './formresponses.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react' 

import Footer from '../Footer'

export default function FormResponsesPage(props) {
    
    const [job,setJob] = useState({'jobTitle':'Dummy Graphic Designer','CVFormLink':'ajhdskjfhdsk','acceptableCVScore':'70','appDeadline':'05/01/2024','status':'Collecting Applications','jobDesc':'The ideal candidates will have strong creative skills and a portfolio of work which demonstrates their passion. Minimum Education Required is a Bachelors degree in Computer Science,Software Engineering, IT, or related degree. Skills Required: Photoshop, Illustrator/Corel Draw, AdobeXD, Figma and others within Adobe Creative Cloud Suite. First-hand knowledge of: UX Design required. An understanding/appreciation for UX Basic Coding: An understanding of how creative sits within digital platforms such as: HTML, CSS and JavaScript. A good understanding of mobile first design is required. Responsibilities include creating design for pages of web applications using WordPress and creating web pages for fronted using HTML,CSS and JavaScript.'})
    const [jobTitle,setJobTitle] = useState()
    //const [questions,setQuestions] = useState(['Have you graduated yet?','How many years of Experience with ReactJS?',"Can you relocate to Lahore?","Where did you graduate from?"])
    const [questions, setQuestions] = useState([]);
    //const [responses, setResponses] = useState([]);   
    const [questionslength,setQuesLen] = useState()
    const [resps,setResp] = useState([])

    const getFormResponses = () =>{
        var param = {'jobId':props.job._id};
        axios.post("http://localhost:8000/nabeeha/fetchformresponses",param).then((response) => {
          
        
        setResp(response.data.formResponses);
        
        
        setQuesLen(response.data.formResponses[0].answers.length)
        response.data.formResponses[0].answers.forEach((answer) => {
            
                // Add the unique question to the state array
                if (!questions.includes(answer.question)) {
                    setQuestions((prevQuestions) => [...prevQuestions, answer.question]);
                }
                
              
          });
        //alert(questions.length) 
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        });
    }
    useEffect(() => {
         
        /*Over here props will be used to set the Questions in setQuestions */
        /*Over here props will be used to set the Responses in setResponses */
        //alert(JSON.stringify(props.job.jobTitle))
        setJobTitle(props.job.jobTitle)
        getFormResponses()
        
     }, []);
 
     return (
        <div className='kcvcollectionpage-con'>
          <div className='kcvcollectionpage-header'>
            <label className='kcvcollectionpage-header-title'>Form Responses for {jobTitle}</label>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-deadline-div'>
              <label className='kcvcollectionpage-deadline'>{resps.length}</label> 
              <label className='kcvcollectionpage-deadline-title'>Received Responses</label>
            </div>
          </div>
          <div className='kcvcollectionpage-inner'>
            <table className='kcvcollectionpage-table'>
              <thead className='kcvcollectionpage-table-header'>
                <tr className='kcvcollectionpage-table-header-row'>
                  <th align="center">#</th>
                  
                  <th align="center">Email</th>
                 
                  {questions.slice(0, questionslength).map((quest, index) => (
  
  <th key={index} align="center">{quest}</th>
))}
                  
                </tr>
              </thead>
              <tbody className='kcvcollectionpage-table-body'>
                {resps && resps.map((app, index) => (
                    <tr key={index} className='kcvcollectionpage-table-row'>
                        <td align="center">{index + 1}</td>
                        <td align="center">{app.applicantEmail}</td>
                        
                        {app.answers.map((answer, ansIndex) => (
                        <td key={ansIndex} align="center">{answer.answerStatement}</td>
                        ))}
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };