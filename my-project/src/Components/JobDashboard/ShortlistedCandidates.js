import React, { useEffect, useState } from 'react';
import './Shortlisted.css';
import cvImg from '../images/cvbtn.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import ReactModal from 'react-modal';
import ConfirmModal from '../ModalWindows/ConfirmRequestModal';

export default function Shortlisted(props) {

    const navigate = useNavigate();

    const [applications, setApps] = useState([]);
    const [job, setJob] = useState({
        'jobTitle': 'Loading..',
        'CVFormLink': 'Loading..',
        'AccCVScore': { $numberDecimal: '0' },
        'CVDeadline': 'dd/mm/yyyy',
        'status': '0',
        'jobDescription': 'Loading..'
    });

    const [errorStatus, setErrStat] = useState(false);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [allCandidatesSelected, setAllCandidatesSelected] = useState(false);

    const [formEmailBody, setEmail] = useState();
    const [emailSet,setEmailSet] = useState();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setModal2Open] = useState(false);
    const [openModal3, setModal3Open] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");

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

    const handleDefaultEmailChange = (event) => {
        setEmail(event.target.value);
      };

    const handleSave=()=>{
        //alert("hei")
        if (!formEmailBody || formEmailBody.trim() == ""){
            setTitle("Error")
            setMessage("Please enter an email body!");
            setOpenModal(true);
            return;
        }

        let param = { jobId: job._id, acceptEmailSub: "Regarding Your Application for "+ job?.jobTitle + " at company "+ job?.companyname, acceptEmailBody: formEmailBody   };
        axios.post('http://localhost:8000/komal/setacceptanceemail',param)
        .then(response => {

            if (response.data.status == "success"){
                setEmailSet(true);
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
        if (props.job) {
            setJob(props.job);
            var param = { 'jobID': props.job._id };
            axios.post("http://localhost:8000/komal/getshortlistedapplications", param)
                .then((response) => {
                    if (response.data.status === "success") {
                        setApps(response.data.applications);
                        setErrStat(false);
                    } else {
                        console.error("Error: " + response.data.error);
                        setErrStat(true);
                    }
                })
                .catch(function (error) {
                    console.error("Axios Error:" + error);
                    setErrStat(true);
                });

                if (props.job.acceptEmailBody){
                    setEmail(props.job.acceptEmailBody);
                    setEmailSet(true);
                }
                else {
                    let param2 = { jobId: props.job._id  };
                    axios.post('http://localhost:8000/komal/getacceptanceemail',param2)
                    .then(response => {

                        if (response.data.status == "success"){
                    
                            setEmail(response.data.email);
                            setEmailSet(true);
                        }
                        else if (response.data.status == "error") {
                            console.error('Error getting email:', response.data.error);
                            setTitle("Error")
                            setMessage("Something went wrong, please try again.");
                            setOpenModal(true);
                            setEmailSet(false);
                        }
                        else {
                            setEmailSet(false);
                            setEmail("Congratulations! You have been selected for the role!\n\nWe are looking forward to work with you. Feel free to contact us in case of any queries.\n\n")
                        }
                        
                    })
                    .catch(error => {
                    console.error('Error getting email:', error);
                    setTitle("Error")
                    setMessage("Something went wrong, please try again.");
                    setOpenModal(true);
                    setEmailSet(false);
                    });
                }
        }
    }, [props]);

    const toggleCandidateSelection = (candidate) => {
        const selectedIndex = selectedCandidates.indexOf(candidate);
        let newSelectedCandidates = [...selectedCandidates];

        if (selectedIndex === -1) {
            newSelectedCandidates = [...newSelectedCandidates, candidate];
        } else {
            newSelectedCandidates.splice(selectedIndex, 1);
        }

        setSelectedCandidates(newSelectedCandidates);
    };

    const toggleAllCandidatesSelection = () => {
        if (!allCandidatesSelected) {
            const selectableCandidates = applications.filter(app => app.status !== 5 && app.status !== -5);
            setSelectedCandidates(selectableCandidates);
        } else {
            setSelectedCandidates([]);
        }

        setAllCandidatesSelected(!allCandidatesSelected);
    };

    const openCV = (path) => {
        navigate("cvview", { state: path });
    };

    const handleAccept = () => {
        if (!emailSet)
        {
            setTitle("Error")
            setMessage("Acceptance Email not saved yet!")
            setOpenModal(true);
            return;
        }

        if (!selectedCandidates || selectedCandidates.length == 0){
            setTitle("Error")
            setMessage("No candidates selected!")
            setOpenModal(true);
            return;
        }
        
        setModal2Open(true);
    };

    const handleReject = () => {

        if (!selectedCandidates || selectedCandidates.length == 0){
            setTitle("Error")
            setMessage("No candidates selected!")
            setOpenModal(true);
            return;
        }

        setModal3Open(true);
    };

    const confirmAccept = (list) => {
        let param = { selectedApps: selectedCandidates,jobApps: applications  };
        axios.post('http://localhost:8000/komal/acceptcandidate',param)
        .then(response => {

            if (response.data.status == "success"){
                setApps(response.data.updatedApplications)
                setModal2Open(false);
                setTitle("Candidates Accepted")
                setMessage("The acceptance emails have been sent successfully!");
                setOpenModal(true);
            }
            else {
                console.error('Error accepting:', response.data.error);
                setModal2Open(false);
                setTitle("Error")
                setMessage("Something went wrong, please try again.");
                setOpenModal(true);
            }
            
        })
        .catch(error => {
            setModal2Open(false);
          console.error('Error accepting:', error);
          setTitle("Error")
          setMessage("Something went wrong, please try again.");
          setOpenModal(true);
        });
    };

    const confirmReject = (list) => {
        let param = { selectedApps: selectedCandidates,jobApps: applications  };
        axios.post('http://localhost:8000/komal/rejectcandidate',param)
        .then(response => {

            if (response.data.status == "success"){
                setApps(response.data.updatedApplications)
                setModal3Open(false);
                setTitle("Candidates Rejected")
                setMessage("The rejection emails have been sent successfully.");
                setOpenModal(true);
            }
            else {
                console.error('Error rejecting:', response.data.error);
                setModal3Open(false);
                setTitle("Error")
                setMessage("Something went wrong, please try again.");
                setOpenModal(true);
            }
            
        })
        .catch(error => {
            setModal3Open(false);
          console.error('Error rejecting:', error);
          setTitle("Error")
          setMessage("Something went wrong, please try again.");
          setOpenModal(true);
        });
    };

    return (
        <div className='kshortlistedpage-con'>
            <div className='kshortlistedpage-header'>
                <label className='kshortlistedpage-header-title'>Shortlisted Candidates for {job.jobTitle}</label>
                <div className='kshortlistedpage-header-vr'></div>
                <div className='kshortlistedpage-deadline-div'>
                    <label className='kshortlistedpage-deadline'>{applications.length}</label>
                    <label className='kshortlistedpage-deadline-title'>Candidates</label>
                </div>
            </div>
            {errorStatus ? (
                <div className='kjobdashboard-error-div'>Something went wrong, please try again..</div>
            ) : (<>
                <div className='kshortlistedpage-inner'>
                    {applications.length === 0 ? (
                        <label className='kshortlistedpage-noapps'>No shortlisted applicants.</label>
                    ) : (
                        <>
                            <div className='kshortlistedpage-appbuttons'>
                                <div className='kshortlistedpage-appbuttons-inner'>
                                    <button className='kshortlistedpage-appbuttons-accept' onClick={() => handleAccept()}>Accept</button>
                                    <button className='kshortlistedpage-appbuttons-reject' onClick={() => handleReject()}>Reject</button>
                                </div>
                                <button className='kshortlistedpage-appbuttons-email' onClick={()=>setModalIsOpen(true)}>Set Acceptance Email</button>
                            </div>
                            <table className='kshortlistedpage-table'>
                                <thead className='kshortlistedpage-table-header'>
                                    <tr className='kshortlistedpage-table-header-row'>
                                        <th align="center">
                                            <input type="checkbox" checked={allCandidatesSelected} onChange={toggleAllCandidatesSelection} />
                                        </th>
                                        <th align="center">Rank</th>
                                        <th align="center">Name</th>
                                        <th align="center">Email</th>
                                        <th align="center">Final Score</th>
                                        <th align="center">Overview</th>
                                    </tr>
                                </thead>
                                <tbody className='kshortlistedpage-table-body'>
                                    {applications.map((app, index) => (
                                        <tr className='kshortlistedpage-table-row' key={index} style={{
                                            backgroundColor: app.status === 5 ? '#b3e882' : app.status === -5 ? '#ff6459' : 'transparent'
                                        }}>
                                            <td align="center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCandidates.includes(app)}
                                                    onChange={() => toggleCandidateSelection(app)}
                                                    disabled={app.status === 5 || app.status === -5}
                                                />
                                            </td>
                                            <td align="center">{index + 1}</td>
                                            <td align="center">{app.name}</td>
                                            <td align="center">{app.email}</td>
                                            <td align="center">{app.finalScore.toFixed(2)}</td>
                                            <td align="center">
                                                <button className='kshortlistedpage-table-cvbtn'>
                                                    View<img src={cvImg} className='kshortlistedpage-table-cvimg' alt="CV" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div></>
            )}
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
      <ConfirmModal
                      isOpen={openModal2}
                      title={"Acceptance Confirmation"}
                      message={'Are you sure you want to accept the selected candidates?'}
                      value={selectedCandidates}
                      removeValue={confirmAccept}
                      closeModal={() => {
                        setModal2Open(false);
                      }}
                    />
                    <ConfirmModal
                      isOpen={openModal3}
                      title={'Rejection Confirmation'}
                      message={'Are you sure you want to reject the selected candidates?'}
                      value={selectedCandidates}
                      removeValue={confirmReject}
                      closeModal={() => {
                        setModal3Open(false);
                      }}
                    />
        </div>
    );
}
