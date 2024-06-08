import React, { useEffect, useState } from 'react';
import './JobDashboard.css';
import Footer from '../Footer';
import loading from '../images/loading3.gif';
import JobDetails from './JobDetails'
import CVCollection from './CVCollection';
import CVScreening from './CVScreening';
import FormCreating from './FormCreating';
import TestCreating from './TestCreateButton';
import TestEditing from './TestEditButton';
import FormResponsesPage from '../RecruiterFormResponses/formresponses';
import axios from 'axios';
import ShortlistedFormResponsesPage from '../RecruiterFormResponses/shortlistedformresponses';
import VideoInterview from './VideoInterview';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoResponses from '../RecruiterVideoResponses/videoresponsespage'
 
import TestResponses from '../RecruiterVideoResponses/testresponsespage'

import VideoEditBtn from './VideoEditBtn';
import ShortlistBefore from './ShortlistTabBefore';
import Shortlisted from './ShortlistedCandidates';


export default function JobDashboardPage() {

    const tabs = ["Job Details","Phase 1: CV Screening","Phase 2: Form Screening","Phase 3: Video Interview","Phase 4: Technical Test","Shortlisted Candidates"];

    const [content,setContent] = useState(<img src={loading} className='kjobdashboardpage-loading-img'></img>)
    const [activeTab,setActiveTab] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

   // var tempJobID = '657d9dd3d75435064f67d066';
    const [job,setJob] = useState(null);
    const [testExists,setTestExists] = useState(false);
    const [videoExists,setVideoExists] = useState(false);

    useEffect(() => {
        //openTab(0);
        if (location.state){
        var param = {'jobId':location.state.jobID};
        axios.post("http://localhost:8000/komal/getjob",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              axios.post("http://localhost:8000/komal/checktestcreated",param).then((response) => {
                if (response.data.status == "success"){
                     setTestExists(response.data.found)
                  }
                  else 
                    setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
                  //alert('hi');
              })
              .catch(function (error) {
                  setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
                  console.log(error);
              });
              axios.post("http://localhost:8000/komal/checkvideocreated",param).then((response) => {
                if (response.data.status == "success"){
                     setVideoExists(response.data.found)
                  }
                  else 
                    setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
                  //alert('hi');
              })
              .catch(function (error) {
                  setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
                  console.log(error);
              });
            }
            else 
              setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
            //alert('hi');
        })
        .catch(function (error) {
            setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
            console.log(error);
        });}

        
      }, [location]);

      useEffect(() => {
        if (job) {
          const savedTab = sessionStorage.getItem('activeTab');
          if (savedTab !== null) {
            openTab(parseInt(savedTab));
          }
          else
            openTab(0);
        }
      }, [job,testExists,videoExists]);

      const updateJob = (newVal) => {
        //window.location.reload()
        // alert(JSON.stringify(newVal))
        // var copy = {...newVal};
         setJob(newVal);
      };

    const openTab=(index)=>{

        if (!job)
        {
            setContent(<div className='kjobdashboard-error-div'>Something went wrong, please try again!</div>);
            return;
        }

        var selected = document.getElementById('kjobdashboardpage-tab'+index);
        var prev = document.getElementById('kjobdashboardpage-tab'+activeTab);

        if (prev)
            prev.classList.remove('kjobdashboardpage-tab-active');
        selected.classList.add('kjobdashboardpage-tab-active');

        if (index == 0)
        {
            setContent(<JobDetails job={job} updateJob={updateJob} testExists={testExists} videoExists={videoExists}></JobDetails>);
        }
        else if (index == 1)
        {
            if (job.status >= 2 || (job.status == 1 && job.noShortlisted) || (job.status == 1 && !job.automated && job.shortlistedCVWaiting)) // cv screening completed
              setContent(<CVScreening job={job} updateJob={updateJob}></CVScreening>)
            else
              setContent(<CVCollection job={job}></CVCollection>)
        }
        else if (index == 2){
          
            //const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'yyyy-mm-dd' format
            if (job.status == 1) {
               
              if (!job.P2FormLink || job.P2FormLink.trim() == ''){ 
                    setContent(<FormCreating job={job}></FormCreating>)
                }
                else { // form created and waiting for cv screening to complete
                  setContent(<div className='kformcreated-con'>
                    <div className='kformcreated-header'>
                      <label className='kformcreated-header-title'><b>Form Screening</b></label>
                      <hr></hr>
                      <label className='kformcreated-header-job'><b>Job: </b>{job.jobTitle}</label>
                    </div>
                    <div className='kformcreated-content'>
                      <label>Form has been created!</label>
                      <label>Please wait till phase 1 (CV Screening) is completed to proceed to Form Screening.</label>
                      <button className='kp2formcreating-createbtn' onClick={()=>navigate('\editform',{state:{'job':job}})}>Edit Form</button>
                      
                    </div>
                  </div>)
                }
            }
            
            else if (!job.P2FormLink || job.P2FormLink.trim() == ''){ // cv screening completed but form not created yet
                setContent(<FormCreating job={job}></FormCreating>)
            }
            else {
              if (job.status >= 3 || (job.status == 2 && job.noShortlisted)) //phase 2 complete and apps shortlisted)
                setContent(<ShortlistedFormResponsesPage job={job}></ShortlistedFormResponsesPage>)
              else//form has been created - form responses coming
                setContent(<FormResponsesPage job={job}></FormResponsesPage>)

            }
        }
        else if (index == 3) {
          
          //setContent(<VideoResponses job={job}></VideoResponses>)
              if (!videoExists)
                setContent(<VideoInterview job={job}></VideoInterview>); 
              else if (!testExists || job.status < 3 || new Date(job.P3StartDate) > new Date())
              {
              
                setContent(<VideoEditBtn job={job}></VideoEditBtn>) // put edit video button here
              }
              else {
                setContent(<VideoResponses job={job}></VideoResponses>)
              }


        }
        else if (index == 4) {
          //setContent(<TestResponses job={job}/>);
          if (!testExists)
            setContent(<TestCreating job={job}></TestCreating>)
          else if (job.status < 3 || new Date(job.P3StartDate) > new Date())
            setContent(<TestEditing job={job}></TestEditing>)
          else // test responses page should be here
            setContent(<TestResponses job={job}/>);
            
        }
         else if (index == 5) {
          if (job.status < 5)
            setContent(<ShortlistBefore job={job}></ShortlistBefore>)
          else 
            setContent(<Shortlisted job={job}></Shortlisted>)
         }
        else {
          setContent(<img src={loading} className='kjobdashboardpage-loading-img'></img>);
        }

        setActiveTab(index);
        
        sessionStorage.setItem('activeTab', index);
    }

  return (
    <div className='kjobdashboardpage-con'>
      <div className='kjobdashboardpage-header'>
        {tabs.map((tab,index)=>(
            <button className='kjobdashboardpage-tab' id={'kjobdashboardpage-tab'+index} onClick={()=>openTab(index)}>{tab}</button>
        ))}
      </div>
      <div className='kjobdashboardpage-middle'>
            {content}
      </div>
      <div className='kjobdashboardpage-footer'>
        <Footer />
      </div>
    </div>
  );
}
