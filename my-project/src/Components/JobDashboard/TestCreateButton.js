import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';

export default function TestCreating(props) {

  const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
  const [videoExists,setVideoExists] = useState();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
      if (props.job){
          setJob(props.job);
          var param = {'jobId':props.job._id};
          axios.post("http://localhost:8000/komal/checkvideocreated",param).then((response) => {
                if (response.data.status == "success"){
                     setVideoExists(response.data.found)
                  }
                  else {
                    setMessage("Something went wrong!");
                    setMessageTitle('Error');
                    setOpenModal(true);}
              })
              .catch(function (error) {
                  setMessage("Something went wrong!");
                  setMessageTitle('Error');
                  setOpenModal(true);
                  console.log(error);
              });
      }
      }, [props.job]);
    
    const navigate = useNavigate();

    const handleMakeTest=()=>{
        if (videoExists)
          navigate('\maketest',{state:{'job':job}})
        else {
          setMessage("Please create Video Interview first!");
                  setMessageTitle('Error');
                  setOpenModal(true);
        }
    }

    return (
      <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>
            <label className='kp2formcreating-header-title'>Create Technical Test for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={handleMakeTest}>Create Technical Test</button>
            {/*<button className='kp2formcreating-skipbtn'>Skip Form Screening</button>*/}
        </div>
        <MessageModal
        isOpen={openModal}
        message={message}
        title={messageTitle}
        closeModal={() => {
            setOpenModal(false);
        }}
      />
      </div>
    )
  }