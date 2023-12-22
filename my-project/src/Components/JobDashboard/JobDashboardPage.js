import React, { useEffect, useState } from 'react';
import './JobDashboard.css';
import Footer from '../Footer';
import loading from '../images/loading3.gif';
import JobDetails from './JobDetails'
import CVCollection from './CVCollection';
import CVScreening from './CVScreening';
import FormCreating from './FormCreating';
import FormResponsesPage from '../RecruiterFormResponses/formresponses';
import axios from 'axios';
import ShortlistedFormResponsesPage from '../RecruiterFormResponses/shortlistedformresponses';
import { useLocation } from 'react-router-dom';

export default function JobDashboardPage() {

    const tabs = ["Job Details","Phase 1: CV Screening","Phase 2: Form Screening","Phase 3: Video Interview","Phase 4: Technical Test","Shortlisted Candidates"];

    const [content,setContent] = useState(<img src={loading} className='kjobdashboardpage-loading-img'></img>)
    const [activeTab,setActiveTab] = useState(0);

    const location = useLocation();

   // var tempJobID = '657d9dd3d75435064f67d066';
    const [job,setJob] = useState(null);

    useEffect(() => {
        //openTab(0);
        if (location.state){
        var param = {'jobId':location.state.jobID};
        axios.post("http://localhost:8000/komal/getjob",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
            }
            else 
              alert("Error: cannot find job!");
            //alert('hi');
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        });}
      }, [location]);

      useEffect(() => {
        if (job) {
          openTab(0);
        }
      }, [job]);

      const updateJob = (newVal) => {
        
        setJob(newVal);
      };

    const openTab=(index)=>{
        var selected = document.getElementById('kjobdashboardpage-tab'+index);
        var prev = document.getElementById('kjobdashboardpage-tab'+activeTab);

        if (prev)
            prev.classList.remove('kjobdashboardpage-tab-active');
        selected.classList.add('kjobdashboardpage-tab-active');

        if (index == 0)
        {
            setContent(<JobDetails job={job} updateJob={updateJob}></JobDetails>);
        }
        else if (index == 1)
        {
            // if deadline passed
            //setContent(<CVScreening></CVScreening>)
            // else
            setContent(<CVCollection job={job}></CVCollection>)
        }
        else if (index == 2){
          
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'yyyy-mm-dd' format
            if (currentDate <= job.CVDeadline) {
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
                    </div>
                  </div>)
                }
            }
            else if (!job.P2FormLink || job.P2FormLink.trim() == ''){ // cv screening completed but form not created yet
                setContent(<FormCreating job={job}></FormCreating>)
            }
            else {
            // else if form has been created - form responses coming
                setContent(<FormResponsesPage></FormResponsesPage>)
            // else (phase 2 complete and apps shortlisted)
            //setContent(<ShortlistedFormResponsesPage></ShortlistedFormResponsesPage>)
            }
        }
        else {
            setContent(<img src={loading} className='kjobdashboardpage-loading-img'></img>);
        }

        setActiveTab(index);
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
