import React, { useEffect, useState } from 'react' 
import './JobDashboard.css';
import EditModal from '../ModalWindows/EditNumberModal'
import EditDeadlineModal from '../ModalWindows/EditDeadlineModal'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobDetails(props) {

  const navigate = useNavigate();

    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [jobStatus,setStatus] = useState("Loading..");
    const [statusDiv,setStatusDiv] = useState(<>Loading...</>);
    const [deadlineDiv,setDeadlineDiv] = useState(<>Loading...</>);

    const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

    const openEditScoreModal = () => {
      setIsEditScoreModalOpen(true);
    };
  
    const closeEditScoreModal = () => {
      setIsEditScoreModalOpen(false);
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
  
    const saveAcceptableScore = (newVal) => {
      
      var param = {'jobId':job._id,'newScore':newVal};
        axios.post("http://localhost:8000/komal/editjobcvscore",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>CV collection form link: </b>{"http://localhost:3000/applicant/cvcollection/" + job._id}</label>
              <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {newVal}%</label>
              <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>)
            }
            else 
              alert("Error: "+response.data.error);
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        })
      setIsEditScoreModalOpen(false);
    };

    const saveCVDeadline=(newVal)=>{
      var param = {'jobId':job._id,'newDeadline':newVal};
        axios.post("http://localhost:8000/komal/editjobcvdeadline",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {new Date(response.data.job.CVDeadline).toLocaleDateString('en-GB')}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditCVDeadlineModal}>Edit Deadline</button></>)
            }
            else 
              alert("Error: "+response.data.error);
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        })
      setIsEditCVDeadlineModalOpen(false);
    }

    const saveFormDeadline=(newVal)=>{
      var param = {'jobId':job._id,'newDeadline':newVal};
        axios.post("http://localhost:8000/komal/editjobformdeadline",param).then((response) => {
           if (response.data.status == "success"){
              setJob(response.data.job);
              props.updateJob({...response.data.job});
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for form responses:</b> {new Date(response.data.job.P2FormDeadline).toLocaleDateString('en-GB')}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditFormDeadlineModal}>Edit Deadline</button></>);
            }
            else 
              alert("Error: "+JSON.stringify(response.data.error));
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        })
      setIsEditFormDeadlineModalOpen(false);
    }

    useEffect(() => {
        if (props.job){
            setJob(props.job);
        }
      }, [props.job]);

    useEffect(() => {
        //alert(job.status)
          if (job.status == 0)
          {
            setStatus("Loading..");
            setStatusDiv(<>Loading...</>);
          }
          else if (job.status == 1)
          {
              setStatus("Phase 1 (CV Screening)");
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>CV collection form link: </b>{"http://localhost:3000/applicant/cvcollection/" + job._id}</label>
              <label className='kjobdetailspage-cvscore'><b>Acceptable CV-JD Match Score:</b> {job.AccCVScore.$numberDecimal.toString()}%</label>
              <button className='kjobdetailspage-editcvscore' onClick={openEditScoreModal}>Edit Acceptable Score</button></>);
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for applications:</b> {new Date(job.CVDeadline).toLocaleDateString('en-GB')}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditCVDeadlineModal}>Edit Deadline</button></>);
          }
          else if (job.status == 2){
            setStatus("Phase 2 (Form Screening)");

            if (!job.P2FormLink || job.P2FormLink.trim() == ''){
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>Phase 2 form link</b> will be available once form has been created</label></>);
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'>Waiting for Form Creation..</label><button className='kjobdetailspage-editcvscore' onClick={()=>navigate('\createform',{state:{'job':job}})}>Create Phase 2 Form</button></>);
            } else{
              setStatusDiv(<><label className='kjobdetailspage-cvlink'><b>Phase 2 form link:</b> {job.P2FormLink}</label></>);
              setDeadlineDiv(<><label className='kjobdetailspage-appdeadline'><b>Deadline for form responses:</b> {new Date(job.P2FormDeadline).toLocaleDateString('en-GB')}</label>
              <button className='kjobdetailspage-editdeadline' onClick={openEditFormDeadlineModal}>Edit Deadline</button></>);
            }
          }
          else if (job.status == 3)
            setStatus("Phase 3 (Video-Interview)")
          else if (job.status == 4)
            setStatus("Phase 4 (Technical Test)")
          else if (job.status == 5)
            setStatus("Shortlisted")
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
                <label className='kjobdetailspage-jd-title'>Job Description</label>
                <hr className='kjobdetailspage-jd-hr'></hr>
                <p className='kjobdetailspage-jd'>{job.jobDescription}</p>
            </div>
        </div>
        <EditModal
        isOpen={isEditScoreModalOpen}
        title='Acceptable CV Score'
        closeModal={closeEditScoreModal}
        saveValue={saveAcceptableScore}
        originalValue={job.AccCVScore.$numberDecimal}
      />
        <EditDeadlineModal
        isOpen={isEditCVDeadlineModalOpen}
        title='Applications Deadline'
        closeModal={closeEditCVDeadlineModal}
        saveValue={saveCVDeadline}
        originalValue={job.CVDeadline}
      />
        <EditDeadlineModal
        isOpen={isEditFormDeadlineModalOpen}
        title='Applications Deadline'
        closeModal={closeEditFormDeadlineModal}
        saveValue={saveFormDeadline}
        originalValue={job.P2FormDeadline}
      />
      </div>
    )
  }