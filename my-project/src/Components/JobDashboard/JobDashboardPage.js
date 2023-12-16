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

export default function JobDashboardPage() {

    const tabs = ["Job Details","Phase 1: CV Screening","Phase 2: Form Screening","Phase 3: Video Interview","Phase 4: Technical Test","Shortlisted Candidates"];

    const [content,setContent] = useState(<img src={loading} className='kjobdashboardpage-loading-img'></img>)
    const [activeTab,setActiveTab] = useState(0);

    var tempJobID = '657b4b1e9e4587758c2e4cdc';
    const [job,setJob] = useState(null);

    useEffect(() => {
        //openTab(0);

        var param = {'jobId':tempJobID};
        axios.post("http://localhost:8000/getjob",param).then((response) => {
           // alert(JSON.stringify(response.data));
           if (response.data.status == "success"){
              setJob(response.data.job);
            }
            else 
              alert("Error: cannot find job!");
            //alert('hi');
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        });
      }, []);

      useEffect(() => {
        if (job) {
          openTab(0);
        }
      }, [job]);

    const openTab=(index)=>{
        var selected = document.getElementById('kjobdashboardpage-tab'+index);
        var prev = document.getElementById('kjobdashboardpage-tab'+activeTab);

        if (prev)
            prev.classList.remove('kjobdashboardpage-tab-active');
        selected.classList.add('kjobdashboardpage-tab-active');

        if (index == 0)
        {
            setContent(<JobDetails job={job}></JobDetails>);
        }
        else if (index == 1)
        {
            // if deadline passed
            setContent(<CVScreening></CVScreening>)
            // else
            //setContent(<CVCollection></CVCollection>)
        }
        else if (index == 2){
            // if in phase 1/2 and form not created yet -> create form
            //setContent(<FormCreating></FormCreating>)
            // else if phase 2 ongoing
            //setContent(<FormResponsesPage></FormResponsesPage>)
            // else phase 2 shortlisted
            setContent(<ShortlistedFormResponsesPage></ShortlistedFormResponsesPage>)
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
