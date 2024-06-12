import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import MessageModal from '../ModalWindows/MessageModal';
import axios from 'axios';

export default function ShortlistBefore(props) {

  const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
  
    const [formEmailBody, setEmail] = useState(
        "Congratulations! You have been selected for the role!\n\nWe are looking forward to work with you. Feel free to contact us in case of any queries.\n\n"
    );

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");

    const [replyTo,setReplyTo] = useState("");


    useEffect(()=>{
        let param = { jobId: props.job._id  };
        axios.post('http://localhost:8000/komal/getacceptanceemail',param)
        .then(response => {

            if (response.data.status == "success"){
                //alert(JSON.stringify(response.data))
                setEmail(response.data.email);
                setReplyTo(response.data.replyTo)
            }
            else if (response.data.status == "error") {
                console.error('Error getting email:', response.data.error);
          setTitle("Error")
          setMessage("Something went wrong, please try again.");
          setOpenModal(true);
            }
            
        })
        .catch(error => {
          console.error('Error getting email:', error);
          setTitle("Error")
          setMessage("Something went wrong, please try again.");
          setOpenModal(true);
        });
    },[])


    const handleDefaultEmailChange = (event) => {
        setEmail(event.target.value);
      };

    const handleSave=()=>{
        //alert("hei")
        if (!formEmailBody || formEmailBody.trim() == "" || !replyTo || !replyTo.trim()){
            setTitle("Error")
            setMessage("Please fill all fields!");
            setOpenModal(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(replyTo.trim())) {
            setTitle("Error");
            setMessage("Please enter a valid email address!");
            setOpenModal(true);
            return;
        }

        let param = { jobId: job._id, acceptEmailSub: "Regarding Your Application for "+ job?.jobTitle + " at company "+ job?.companyname, acceptEmailBody: formEmailBody, acceptEmailReplyTo: replyTo   };
        axios.post('http://localhost:8000/komal/setacceptanceemail',param)
        .then(response => {

            if (response.data.status == "success"){
        
            setTitle("Email Saved")
            setMessage("The acceptance email has been saved successfully!");
            setOpenModal(true);
            setModalIsOpen(false);
            }
            else {
                console.error('Error saving email:', response.data.error);
          setTitle("Error")
          setMessage("Something went wrong, please try again.");
          setOpenModal(true);
            }
            
        })
        .catch(error => {
          console.error('Error saving email:', error);
          setTitle("Error")
          setMessage("Something went wrong, please try again.");
          setOpenModal(true);
        });

    }
  
  useEffect(() => {
      if (props.job)
          setJob(props.job);
      }, [props.job]);
    
    const navigate = useNavigate();

    return (
      <div className='kp2formcreating-con'>
        <div className='kp2formcreating-header'>       
            <label className='kp2formcreating-header-title'>Set Acceptance Email for {job.jobTitle}</label>
        </div>
        <div className='kp2formcreating-inner'>
            <button className='kp2formcreating-createbtn' onClick={()=>setModalIsOpen(true)}>Set Acceptance Email</button>
            {/*<button className='kp2formcreating-skipbtn'>Skip Form Screening</button>*/}
        </div>
        <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="kcreateformpage-email-modal"
        overlayClassName="kcreateformpage-email-modal-overlay"
      >
        <div className='nisa-ModalContent'>
        
        <h2>Set Acceptance Email</h2>
        <p>This will be the default email sent to the accepted applicants. Please add job-specific details including the offer/ call for in-person interview as required.</p>
        <label><b>Job Title:</b> {job?.jobTitle}</label>
        <label className='kshortlistemail-replyto-label'><b>Email address for candidate to reply to<span className='kreq'>*</span>: </b></label>
         <input type="email" className='kshortlistemail-replyto' value={replyTo} onChange={(event)=>{setReplyTo(event.target.value)}}></input>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>Regarding Your Application for {job?.jobTitle} at company {job?.companyname}</label>
         
          <div>
          </div>
          <textarea className='nabrejemail-textarea' value={formEmailBody} onChange={handleDefaultEmailChange}></textarea>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={()=>setModalIsOpen(false)}>Cancel</button>
        </div>
      </ReactModal><MessageModal
        isOpen={openModal}
        message={message}
        title={title}
        closeModal={() => {
            setOpenModal(false);
        }}
      />
      </div>
    )
  }