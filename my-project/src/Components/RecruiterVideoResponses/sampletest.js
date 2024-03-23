import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './sampletest.css'
import axios from 'axios';
import pie from './piechart.png'
import timeicon from './time.png'
import scoreicon from './score.png'
import correcticon from './correct.png'
import incorrecticon from './incorrect.png'
import missingicon from './missing.png'
import BarChart from './BarChart';

export default function SampleTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [email,setEmail] = useState();
  const [resp,setResp] = useState({overallScore:"-",totalCorrect:"-",totalIncorrect:"-",timeTaken:"-",totalLeft:"-", "categoryPercentages":{
    'Loading..': 0
  }})
  

    useEffect(() => {
        setEmail(location.state.email);
        var param = {'jobID':location.state.thisjob._id,'applicantEmail':location.state.email};
       //alert(JSON.stringify(param))
        axios.post("http://localhost:8000/nabeeha/fetchtestresponsestats",param).then((response) => {
          
        //alert(response.data.formResponses)
        
        setResp(response.data);
       //alert(JSON.stringify(response.data))
       
       
        })
        .catch(function (error) {
            //alert("Axios Error:" + error);
        });
    }, [location.state.thisjob,location.state.email]);
 


   return (
    <div className="post-jobnew-container">
      <div className='video-header'>
        <h3 id="nab-t-resp-head">Technical Test Response for {email} </h3>
        
      </div>
      
      <hr className='nisa-horizontal-line'></hr>
      
      <div className="question-list">
       
          <div className="nab-question-container">
            
              <div >
                <div id="quick-stats">Quick Stats</div>
                <br></br>
                <div id="statsdiv1">
                    <p id="timeiconptage"><img src={timeicon} alt="icon" style={{ width:"28px",height:"25px" }} /><span style={{fontWeight: "bold"}}>&nbsp;Test Completed in:  &nbsp;</span> {resp.timeTaken} minutes</p>
                    <br></br>
                    <p id="timeiconptage"><img src={scoreicon} alt="icon" style={{ width:"28px",height:"25px" }} /><span style={{fontWeight: "bold"}}>&nbsp;Test Score:</span>&nbsp; {resp.overallScore} Points</p>
                    <br></br>
                    <p id="timeiconptage"><img src={correcticon} alt="icon" style={{ width:"23px",height:"21px" }} /><span style={{fontWeight: "bold"}}> &nbsp;Questions correctly attempted:</span>&nbsp; {resp.totalCorrect}</p>
                    <br></br>
                    <p id="timeiconptage"><img src={incorrecticon} alt="icon" style={{ width:"30px",height:"28px" }} /><span style={{fontWeight: "bold"}}>Questions incorrectly attempted:</span>&nbsp; {resp.totalIncorrect}</p>
                    <br></br>
                    <p id="timeiconptage"><img src={missingicon} alt="icon" style={{ width:"25px",height:"18px" }} /><span style={{fontWeight: "bold"}}>&nbsp;Questions not attempted:</span>&nbsp; {resp.totalLeft}</p>
                </div>
              </div>
              <div id="border-sample-test"></div>
              <div id="statsdiv">
              <div id="quick-stats">Category Breakdown</div>
              <br></br>
                <p>Percentage of questions correctly attempted by category</p>
                <br></br>
                <br></br>
                <BarChart data={resp.categoryPercentages} />
              </div>
           
            
          </div>
        
      </div>
      
      <button className="nisa-submit-button" >
        View Test
      </button>
      
    </div>
  );
}
