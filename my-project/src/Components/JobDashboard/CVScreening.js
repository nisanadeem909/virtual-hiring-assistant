import React, { useEffect, useState } from 'react' 
import './CVScreening.css';
import Footer from '../Footer'
import cvImg from '../images/cvbtn.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditModal from '../ModalWindows/EditNumberModal';
import ConfirmModal from '../ModalWindows/ConfirmRequestModal';

export default function CVScreening(props) {

    const navigate = useNavigate();

    const [applications,setApps] = useState([])
    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..', 'automated':true})
    const [errorStatus,setErrStat] = useState(false);
    
    const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const openEditScoreModal = () => {
        setIsEditScoreModalOpen(true);
    };
    
    const closeEditScoreModal = () => {
        setIsEditScoreModalOpen(false);
    };

    const setModalOpen = (value) => {
        setOpenModal(value);
      };

    const saveAcceptableScore = (newVal) => {
      
        var param = {'jobId':job._id,'newScore':newVal};
          axios.post("http://localhost:8000/komal/editjobcvscore/notautomated",param).then((response) => {
             if (response.data.status == "success"){
                setJob(response.data.job);
                props.updateJob({...response.data.job});
               }
              else {
                console.log("Error: "+response.data.error);
              }
          })
          .catch(function (error) {
                console.log(error);
          })
        setIsEditScoreModalOpen(false);
      };

    const confirmShortlisting=()=>{
        var param = {'jobId':job._id,'username':sessionStorage.getItem("sessionID")};
          axios.post("http://localhost:8000/komal/confirmcvshortlisting",param).then((response) => {
             if (response.data.status == "success"){
                setJob(response.data.job);
                props.updateJob({...response.data.job});
               }
              else {
                console.log("Error: "+response.data.error);
              }
          })
          .catch(function (error) {
                console.log(error);
          })
          setModalOpen(false);
    }

    useEffect(() => {
     if (props.job)
     {
         setJob(props.job);
         var param = {'jobId':props.job._id};
         axios.post("http://localhost:8000/komal/getjobapplications",param).then((response) => {
            // alert(JSON.stringify(response.data));
            if (response.data.status == "success"){
                //alert(JSON.stringify(parseFloat(response.data.jobApps[0].CVMatchScore.$numberDecimal)))
                response.data.jobApps.sort((a, b) => parseFloat(b.CVMatchScore.$numberDecimal) - parseFloat(a.CVMatchScore.$numberDecimal));
                setApps(response.data.jobApps);
                setErrStat(false);
             }
             else {
               console.error("Error: "+response.data.error);
               setErrStat(true);
            }
         })
         .catch(function (error) {
            console.error("Axios Error:" + error);
            setErrStat(true);          
         });
     }
     }, [props.job]);
 
     const openCV=(path)=>{
         navigate("cvview" ,  {state: path });
     }

    //  useEffect(() => {
    //     const sortedApplications = [...applications];
    //     sortedApplications.sort((a, b) => b.CVMatchScore.$numberDecimal - a.CVMatchScore.$numberDecimal);
    //     setApps(sortedApplications);
    // }, []);

    return (
      <div className='kcvcollectionpage-con'>
        <div className='kcvcollectionpage-header'>
            <label className='kcvcollectionpage-header-title'>Screened Applications for {job.jobTitle}</label>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-deadline-div'>
                <label className='kcvcollectionpage-deadline'>{applications.length}</label>
                <label className='kcvcollectionpage-deadline-title'>Total Applications</label>
            </div>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-accScore-div'>
                <label className='kcvcollectionpage-accScore'>{job.AccCVScore.$numberDecimal.toString()}%</label>
                <label className='kcvcollectionpage-accScore-title'>Acceptable Match Score</label>
            </div>
        </div>
        {errorStatus ? (
      <div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>
        ) : (
        <div className='kcvcollectionpage-inner'>
        {applications.length === 0 ? (
          <label className='kcvcollectionpage-noapps'>No job applications yet</label>
        ) : (
        <div>
        {(!job.automated && job.status === 1) && (
        <div className='kcvcollection-buttons-edit'>
            <button className='kcvcollection-button-edit' onClick={openEditScoreModal}>Edit Acceptable Score</button>
            <button className='kcvcollection-button-edit' onClick={()=>setOpenModal(true)}>Confirm Shortlisting</button>
        </div>
        )}
        <table className='kcvcollectionpage-table'>
            <thead className='kcvcollectionpage-table-header'>
                <tr className='kcvcollectionpage-table-header-row'>
                    <th align="center">#</th>
                    <th align="center">Name</th>
                    <th align="center">Email</th>
                    <th align="center">CV-JD Match Score</th>
                    <th align="center">Application Date</th>
                    <th align="center">CV</th>
                </tr>
            </thead>
            <tbody className='kcvcollectionpage-table-body'>
                {applications.map((app,index)=>(
                    <tr className='kcvcollectionpage-table-row' style={{ backgroundColor: parseFloat(app.CVMatchScore.$numberDecimal) > parseFloat(job.AccCVScore.$numberDecimal) ? '#b3e882' : '#ff6459' }}>
                        <td align="center">{index+1}</td>
                        <td align="center">{app.name}</td>
                        <td align="center">{app.email}</td>
                        <td align="center"><b>{app.CVMatchScore.$numberDecimal.toString()}</b>%</td>
                        <td align="center">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                        <td align="center"><button className='kcvcollectionpage-table-cvbtn' onClick={()=>openCV(app)}>View CV<img src={cvImg} className='kcvcollectionpage-table-cvimg'></img></button></td>
                    </tr>
                ))}
            </tbody>
            </table></div>
        )}
      </div>
    )}<EditModal
        isOpen={isEditScoreModalOpen}
        title='Acceptable CV Score'
        closeModal={closeEditScoreModal}
        saveValue={saveAcceptableScore}
        originalValue={job.AccCVScore.$numberDecimal}
      />
      <ConfirmModal
                      isOpen={openModal}
                      title={'Confirm Shortlisting'}
                      message={'Are you sure you want to confirm shortlisting and proceed to phase 2?'}
                      value={0}
                      removeValue={confirmShortlisting}
                      closeModal={() => {
                        setModalOpen(false);
                      }}
                    />
  </div>
)}