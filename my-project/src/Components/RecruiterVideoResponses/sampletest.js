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
import Footer from '../Footer';
import MessageModal from '../ModalWindows/MessageModal';

export default function SampleTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [email,setEmail] = useState();
  const [time,setTime] = useState("-")
  const [resp,setResp] = useState({overallScore:"-",totalCorrect:"-",totalIncorrect:"-",timeTaken:"-",totalLeft:"-", "categoryPercentages":{
    'Loading..': 0
  }})
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  

    useEffect(() => {
        setEmail(location.state.email);
        setJob(location.state.thisjob)
        
        var param = {'jobID':location.state.thisjob._id,'applicantEmail':location.state.email};
       //alert(JSON.stringify(param))
        axios.post("http://localhost:8000/nabeeha/fetchtestresponsestats",param).then((response) => {
          
        //alert(response.data.formResponses)
        
        setResp(response.data);
        const timeTakenSeconds = response.data.timeTaken;
        const formattedTime = timeTakenSeconds < 60 ? `${timeTakenSeconds} seconds` : `${Math.floor(timeTakenSeconds / 60)} minutes`;
        setTime(formattedTime);
       
        // alert(timeTakenSeconds)
       
       
        })
        .catch(function (error) {
            console.log("Axios Error:" + error);
            setMessage("Something went wrong, please try again..");
            setMessageTitle('Error');
            setOpenModal(true);
        });
    }, [location.state.thisjob,location.state.email]);
 


   return (<> 
    <div className="post-jobnew-container">
      <div className='video-header'>
        <h3 id="nab-t-resp-head">Technical Test Response for {email} </h3>
        
      </div>
      
      <hr className='nisa-horizontal-line'></hr>
      
      <div className="question-list">
       
          <div className="nab-question-container-techtest">
            
              <div >
                <div id="quick-stats">Quick Stats</div>
                <br></br>
                <div id="statsdiv1">
                    <p id="timeiconptage"><img src={timeicon} alt="icon" style={{ width:"28px",height:"25px" }} /><span style={{fontWeight: "bold"}}>&nbsp;Test Completed in:  &nbsp;</span> {time}</p>
                    <br></br>
                    <p id="timeiconptage"><img src={scoreicon} alt="icon" style={{ width:"28px",height:"25px" }} /><span style={{fontWeight: "bold"}}>&nbsp;Test Score:</span>&nbsp; {resp.overallScore} out of {resp.total} Points</p>
                    <br></br>
                    <p id="timeiconptage"><img src={correcticon} alt="icon" style={{ width:"23px",height:"21px" }} /><span style={{fontWeight: "bold"}}> &nbsp;Questions correctly attempted:</span>&nbsp; {resp.totalCorrect}</p>
                    <br></br>
                    <p id="timeiconptage"><img src={incorrecticon} alt="icon" style={{ width:"23px",height:"23px" }} /><span style={{fontWeight: "bold"}}>&nbsp; Questions incorrectly attempted:</span>&nbsp; {resp.totalIncorrect}</p>
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
      
      <button className="nisa-submit-button" onClick={()=>navigate("fullresponse", { state: { job,'applicant':email } })}>
        View Test
      </button>
      
    </div>
    <MessageModal
        isOpen={openModal}
        message={message}
        title={messageTitle}
        closeModal={() => {
            setOpenModal(false);
        }}
      />
    <Footer></Footer>
    </>
  );
}
