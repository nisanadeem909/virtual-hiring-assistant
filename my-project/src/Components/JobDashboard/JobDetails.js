import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import EditModal from '../ModalWindows/EditNumberModal'
import EditDaysModal from '../ModalWindows/EditDaysModal'
import EditDeadlineModal from '../ModalWindows/EditDeadlineModal'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loading from '../images/loading3.gif';
import EditJDModal from '../ModalWindows/EditJDModal';
import MessageModal from '../ModalWindows/MessageModal';
import FunnelChart from './FunnelChart';
import copyicon from '../images/copy.png'

export default function JobDetails(props) {

  const navigate = useNavigate();

    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [jobStatus,setStatus] = useState("Loading..");
    const [statusDiv,setStatusDiv] = useState(<>Loading...</>);
    const [deadlineDiv,setDeadlineDiv] = useState(<>Loading...</>);
    const [JDDiv, setJDDiv] = useState(<pre className='kjobdetailspage-jd'>{job.jobDescription}</pre>);
    const [openMessageModal, setOpenMsgModal] = useState(false);

    const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);
    const [isEditJDModalOpen, setIsEditJDModalOpen] = useState(false);
    const [isEditDaysModalOpen, setIsEditDaysModalOpen] = useState(false);
    const [videoExists,setVideoExists] = useState(false);
    const [testExists,setTestExists] = useState(false);

    const formatDate = (date) => {
      if (!date) return '';
      const formattedDate = new Date(date); 
      const year = formattedDate.getFullYear();
      const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${formattedDate.getDate()}`.padStart(2, '0');
      let hours = formattedDate.getHours();
      const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
      const amOrPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert 0 to 12 for midnight
  
      return `${day}-${month}-${year} ${hours}:${minutes} ${amOrPm}`;
  };

  const PublicizeJob=()=>{
    const deadlineDate = new Date(job.CVDeadline);
    const currentDate = new Date();

    if (deadlineDate < currentDate) {
      setOpenMsgModal(true);
      return;
    }

    var param ={jobId:job._id};
    axios.post("http://localhost:8000/komal/publicizejob",param).then((response) => {
      if (response.data.status == "success"){
         setJob(response.data.job);
         props.updateJob({...response.data.job});
         setStatus("Phase 1 (CV Screening)");
         setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>CV collection form link: </b>{"http://localhost:3000/applicant/cvcollection/" + response.data.job._id}<img src={copyicon} className='kcopy-icon' onClick={()=>navigator.clipboard.writeText("http://localhost:3000/applicant/cvcollection/" + job._id)}></img></label>
         <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {response.data.job.AccCVScore.$numberDecimal.toString()}%</label>
         <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>)
       }
       else {
         setStatusDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
         console.log("Error: "+response.data.error);
       }
   })
   .catch(function (error) {
       setStatusDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
       console.log(error);
   })
  }

  const openEditScoreModal = () => {
    setIsEditScoreModalOpen(true);
  };

  const closeEditScoreModal = () => {
    setIsEditScoreModalOpen(false);
  };

  const openEditDaysModal = () => {
    setIsEditDaysModalOpen(true);
  };

  const closeEditDaysModal = () => {
    setIsEditDaysModalOpen(false);
  };

  const openEditJDModal = () => {
    setIsEditJDModalOpen(true);
  };

  const closeEditJDModal = () => {
    setIsEditJDModalOpen(false);
  };

    const [isEditCVDeadlineModalOpen, setIsEditCVDeadlineModalOpen] = useState(false);

    const openEditCVDeadlineModal = () => {
      setIsEditCVDeadlineModalOpen(true);
    };
  
    const closeEditCVDeadlineModal = () => {
      setIsEditCVDeadlineModalOpen(false);
    };

    const [isEditFormDeadlineModalOpen, setIsEditFormDeadlineModalOpen] = useState(false);

    const openEditFormDeadlineModal = () => {
      setIsEditFormDeadlineModalOpen(true);
    };
  
    const closeEditFormDeadlineModal = () => {
      setIsEditFormDeadlineModalOpen(false);
    };

    const saveDays=(newVal)=>{
      var param = {'jobId':job._id,'newDays':newVal};

        axios.post("http://localhost:8000/komal/editp3days",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Interview and Test Link remains open for:</b> {newVal} days</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditDaysModal}>Edit Number of Days</button></>);
             }
            else {
              setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
            console.log(error);
        })
        closeEditDaysModal()
    }
  
    const saveAcceptableScore = (newVal) => {
      
      var param = {'jobId':job._id,'newScore':newVal};

      if (job.automated == false && job.shortlistedCVWaiting == true){

        axios.post("http://localhost:8000/komal/editjobcvscore/notautomated",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              if (response.data.job.postjob)
                setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>CV collection form link: </b>{"http://localhost:3000/applicant/cvcollection/" + job._id}<img src={copyicon} className='kcopy-icon' onClick={()=>navigator.clipboard.writeText("http://localhost:3000/applicant/cvcollection/" + job._id)}></img></label>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {newVal}%</label>
                <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>)
              else
              setStatusDiv(<><label className='kjobdetailspage-cvscore'><b className='kjobdetailspage-status'>This job is currently on hold!</b></label><button className='kjobdetailspage-editcvscore' onClick={PublicizeJob}>Publicize Job</button>
              <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {newVal}%</label>
              <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>);
            }
            else {
              setStatusDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setStatusDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
            console.log(error);
        })
      setIsEditScoreModalOpen(false);}
      else {
        axios.post("http://localhost:8000/komal/editjobcvscore",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              if (response.data.job.postjob)
                setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>CV collection form link: </b>{"http://localhost:3000/applicant/cvcollection/" + job._id}<img src={copyicon} className='kcopy-icon' onClick={()=>navigator.clipboard.writeText("http://localhost:3000/applicant/cvcollection/" + job._id)}></img></label>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {newVal}%</label>
                <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>)
              else 
                setStatusDiv(<><label className='kjobdetailspage-cvscore'><b className='kjobdetailspage-status'>This job is currently on hold!</b></label><button className='kjobdetailspage-editcvscore' onClick={PublicizeJob}>Publicize Job</button>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {newVal}%</label>
                <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>);
            }
            else {
              setStatusDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setStatusDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
            console.log(error);
        })
        setIsEditScoreModalOpen(false);
      }
    };

    const saveCVDeadline=(newVal)=>{

      if (job.automated == false && job.shortlistedCVWaiting == true){
        var param = {'jobId':job._id,'newDeadline':newVal};
        axios.post("http://localhost:8000/komal/editjobcvdeadline/notautomated",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {formatDate(response.data.job.CVDeadline)}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditCVDeadlineModal}>Edit Deadline</button></>)
            }
            else {
              setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
            console.log(error);
        })}
      else{
      var param = {'jobId':job._id,'newDeadline':newVal};
        axios.post("http://localhost:8000/komal/editjobcvdeadline",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {formatDate(response.data.job.CVDeadline)}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditCVDeadlineModal}>Edit Deadline</button></>)
            }
            else {
              setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
            console.log(error);
        })}
      setIsEditCVDeadlineModalOpen(false);
    }

    const saveFormDeadline=(newVal)=>{
      var param = {'jobId':job._id,'newDeadline':newVal};
        axios.post("http://localhost:8000/komal/editjobformdeadline",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for form responses:</b> {formatDate(response.data.job.P2FormDeadline)}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditFormDeadlineModal}>Edit Deadline</button></>);
            }
            else {
              setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setDeadlineDiv(<div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>)
            console.log(error);
        })
      setIsEditFormDeadlineModalOpen(false);
    }

    const saveJD=(newTitle,newJD)=>{
      var param = {'jobId':job._id,'newJD':newJD, 'newTitle':newTitle};
        axios.post("http://localhost:8000/komal/editjobdescription",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setJDDiv(<pre className='kjobdetailspage-jd'>{response.data.job.jobDescription}</pre>);
            }
            else {
              setJDDiv(<pre className='kjobdetailspage-jd'>Something went wrong, please try again!</pre>)
              console.log("Error: "+response.data.error);
            }
        })
        .catch(function (error) {
            setJDDiv(<pre className='kjobdetailspage-jd'>Something went wrong, please try again!</pre>)
            console.log(error);
        })
      setIsEditJDModalOpen(false);
    }

    useEffect(() => {
        if (props.job){
            setJob(props.job);
        }
        if (props.testExists)
          setTestExists(props.testExists)
          if (props.videoExists)
            setVideoExists(props.videoExists)
      }, [props.job]);

    useEffect(() => {
          setJDDiv(<pre className='kjobdetailspage-jd'>{job.jobDescription}</pre> ); 

          if (job.status == 0)
          {
            setStatus("Loading..");
            setStatusDiv(<>Loading...</>);
          }
          else if (job.status == 1)
          {
              if (job.postjob){
                setStatus("Phase 1 (CV Screening)");
                setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>CV collection form link: </b>{"http://localhost:3000/applicant/cvcollection/" + job._id}<img src={copyicon} className='kcopy-icon' onClick={()=>navigator.clipboard.writeText("http://localhost:3000/applicant/cvcollection/" + job._id)}></img></label>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {job.AccCVScore.$numberDecimal.toString()}%</label>
                <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>);
              }else {
                setStatus("On Hold");
                setStatusDiv(<><label className='kjobdetailspage-cvscore'><b className='kjobdetailspage-status'>This job is currently on hold!</b></label><button className='kjobdetailspage-editcvscore' onClick={PublicizeJob}>Publicize Job</button>
                <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {job.AccCVScore.$numberDecimal.toString()}%</label>
                <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>);
              }
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {formatDate(job.CVDeadline)}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditCVDeadlineModal}>Edit Deadline</button></>);
          }
          else if (job.status == 2){
            setStatus("Phase 2 (Form Screening)");

            if (!job.P2FormLink || job.P2FormLink.trim() == ''){
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>Phase 2 form link</b> will be available once form has been created</label></>);
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'>Waiting for Form Creation..</label></>);
            } else{
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>Phase 2 form link:</b> {job.P2FormLink}<img src={copyicon} className='kcopy-icon' onClick={()=>navigator.clipboard.writeText(job.P2FormLink)}></img></label></>);
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for form responses:</b> {formatDate(job.P2FormDeadline)}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditFormDeadlineModal}>Edit Deadline</button></>);
            }
          }
          else if (job.status == 3)
          {
            setStatus("Phase 3/4 (Video-Interview and Technical Test)")

            if (!job.P3StartDate){
              setStatusDiv(<><label className='kjobdetailspage-cvlink'>Waiting for Video Interview and Technical Test Creation..</label></>);
              setDeadlineDiv(<label className='kjobdetailspage-appdeadline'>Please create Video Interview Questionnnaire and Technical Test</label>)
            }
            else {
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>Interview and Test Start Date:</b><br></br>{formatDate(job.P3StartDate)}<br></br><br></br><b>Interview and Test link:</b> {'http://localhost:3000/applicant/videointerview/'+job._id}<img src={copyicon} className='kcopy-icon' onClick={()=>navigator.clipboard.writeText("http://localhost:3000/applicant/videointerview/" + job._id)}></img></label></>);
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Interview and Test Link remains open for:</b> {job.P3Days} days</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditDaysModal}>Edit Number of Days</button></>);
            
            }
          }
          // else if (job.status == 4)
          // {
          //   setStatus("Phase 4 (Technical Test)")
          // }
          else if (job.status == 5)
          {
            setStatus("Shortlisted")
            setStatusDiv(<FunnelChart job={job}></FunnelChart>);
            setDeadlineDiv(<>Candidates have been shortlisted! Go to shortlisted tab to accept/reject.</>);
          }
        }, [job.status]);

    return (
      <div className='kjobdetailspage-con'>
        <div className='kjobdetailspage-header'>
            <label className='kjobdetailspage-jobtitle'>{job.jobTitle} Job Details</label>
            <label className='kjobdetailspage-jobstatus'>Current status: {jobStatus}</label>
        </div>
        <div className='kjobdetailspage-inner'>
            <div className='kjobdetailspage-deadline-div'>
              {deadlineDiv}
            </div>
            <div className='kjobdetailspage-cv-div'>
                {statusDiv}
            </div>
            <div className='kjobdetailspage-jd-div'>
            <div className='kjobdetailspage-jd-header'>
                <label className='kjobdetailspage-jd-title'>Job Description</label>
                {job.postjob == false && (
                  <button className='kjobdetailspage-editdeadline' onClick={openEditJDModal}>
                    Edit Job Details
                  </button>
                )}
                </div>
                <hr className='kjobdetailspage-jd-hr'></hr>
                {JDDiv}
            </div>
        </div>
        <EditModal
        isOpen={isEditScoreModalOpen}
        title='Acceptable CV Score'
        closeModal={closeEditScoreModal}
        saveValue={saveAcceptableScore}
        originalValue={job.AccCVScore.$numberDecimal}
      /><EditDaysModal
        isOpen={isEditDaysModalOpen}
        title='Interview and Test Open Days'
        closeModal={closeEditDaysModal}
        saveValue={saveDays}
        originalValue={job.P3Days}
      />
        <EditDeadlineModal
        isOpen={isEditCVDeadlineModalOpen}
        title='Applications Deadline'
        closeModal={closeEditCVDeadlineModal}
        saveValue={saveCVDeadline}
        originalValue={job.CVDeadline}
        next={job.P2FormDeadline}
        nextnext={job.P3StartDate}
        phase={1}
      />
        <EditDeadlineModal
        isOpen={isEditFormDeadlineModalOpen}
        title='Applications Deadline'
        closeModal={closeEditFormDeadlineModal}
        saveValue={saveFormDeadline}
        originalValue={job.P2FormDeadline}
        next={job.P3StartDate}
        phase={2}
      />
      <EditJDModal
        isOpen={isEditJDModalOpen}
        title='Job Details'
        closeModal={closeEditJDModal}
        saveValue={saveJD}
        originalValue={job.jobDescription}
        originalTitle={job.jobTitle}
      /><MessageModal
      isOpen={openMessageModal}
      message={"Please edit CV Deadline before making job public! It has already passed!"}
      title={"Error"}
      closeModal={() => {
        setOpenMsgModal(false);
      }}
    />
      </div>
      
    )
  }