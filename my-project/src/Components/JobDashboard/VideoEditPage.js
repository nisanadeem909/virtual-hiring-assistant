import React, { useEffect, useState } from 'react';
import EditVideo from './EditVideo'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageModal from '../ModalWindows/MessageModal';
import Footer from '../Footer';

export default function VideoEditPage() {
    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [videoTest, setVideoTest] = useState({
        jobTitle: '',
        jobID: '',
        questions: [],
        duration: 0,
        acceptabilityTraits: [ // Array of objects representing acceptability traits
          {
            trait: '',
            weight: 0
          }
        ],
        importance: 0,
        days: 0,
        startDate: null
      });
      
      const [openModal, setOpenModal] = useState(false);
    
      const location = useLocation();
      const stateData = location.state;
      const navigate = useNavigate();


      useEffect(() => {
        setJob(stateData.job);
        
        
        axios.post(`http://localhost:8000/komal/getjobtestnisa?jobID=${stateData.job._id}`) // in dashboard
          .then((response) => {
            if (response.data.status === "success") {
               
              setVideoTest(response.data.test); 
              
            } else {
              console.error(response.data.error);
              setOpenModal(true);
            }
          })
          .catch(function (error) {
            console.error("Axios Error:" + error);
            setOpenModal(true);
          });
        
        }, []);

  return (
    <div>
       <div className='kcreateformpage-con'>
      <div className='kcreateformpage-header'>
        <label className='kcreateformpage-header-title'><b>Edit Video Interview</b></label>
        <hr></hr>
        <label className='kcreateformpage-header-job'><b>Job: </b>{job.jobTitle}</label>
      </div>
      <div className='kcreateformpage-middle'>
        <EditVideo job={job} test={videoTest}></EditVideo>
      </div>
      <div className='kcreateformpage-footer'>
        <Footer />
      </div><MessageModal
        isOpen={openModal}
        message={"Something went wrong, please try again.."}
        title={"Error"}
        closeModal={() => {
            setOpenModal(false);
            navigate(-1,stateData);
        }}
      />
    </div>
    </div>
  )
}
