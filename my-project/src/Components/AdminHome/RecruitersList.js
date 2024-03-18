import React, { useState, useEffect } from 'react';
import './RecruiterList.css';
import './AdminHome.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RemoveModal from '../ModalWindows/ConfirmRemoveModal';

const person = "personcircle.png"

export default function RecruiterList(props) {
  const [recruiters, setRecruiters] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState([]);
  const [errStatus, setErrStatus] = useState(false);
  const [company,setCompany] =useState();

  useEffect(() => {
    if (props.data){
      var param = {'companyID':props.data._id}
    axios.post('http://localhost:8000/komal/getrecruiters',param) 
      .then(response => {
        if (response.data.status === "success") {
          setErrStatus(false);
          setRecruiters(response.data.recs);
          // Initialize openModal as an array with the same length as recruiters
          setOpenModal(Array(response.data.recs.length).fill(false));
        } else {
          console.log('Error:', response.data.error);
          setErrStatus(true);
        }
      })
      .catch(function (error) {
        console.log("Axios error: " + error);
        setErrStatus(true);
      });}
  }, [props]);

  const removeRecruiter = (index) => {
    var param = { 'username': recruiters[index].username };
    axios.post("http://localhost:8000/komal/removerecruiter", param)
      .then((response) => {
        if (response.data.status !== "success") {
          console.log(JSON.stringify(response.data.error));
          setErrStatus(true);
        } else {
          setErrStatus(false);
          var copy = [...recruiters];
          copy.splice(index, 1);
          setRecruiters(copy);
        
          setOpenModal(copy.map(() => false));
        }
      })
      .catch(function (error) {
        console.log("Axios error: " + error);
        setErrStatus(true);
      });
  }
  

  const setModalOpen = (index, value) => {
    var copy = [...openModal];
    copy[index] = value;
    setOpenModal(copy);
  }

  return (
    <div>
      <div className='kom-joblist-con'>
        <h2 className='kom-joblists-head'>
          Recruiter List
        </h2>
        {errStatus ? (
          <div className='k-joblist-error-message'>Something went wrong, please try again..</div>
        ) : (
          recruiters.length === 0 ? (
            <div className='k-joblist-error-message'>No recruiters found.</div>
          ) : (
            <>
              {recruiters.map((rec, index) => (
                <div key={index} className="k-job-row">
                  <div className="k-job-details">
                    <div className='k-recdiv' >
                      <img className='k-rec-profilepic' src={`http://localhost:8000/routes/profilepictures/${rec.profilePic || person}`} alt="Profile"></img>
                      <div>
                        <div className="k-job-title">{rec.name}</div>
                        <div className="k-job-status">
                          {rec.email}
                        </div>
                      </div>
                  </div>
                    </div>
                    <button className="open-k-job-button" onClick={() => setModalOpen(index, true)}>Remove Recruiter</button>
                    <RemoveModal
                      isOpen={openModal[index]}
                      title={rec.username}
                      value={index}
                      removeValue={removeRecruiter}
                      closeModal={() => {
                        setModalOpen(index, false);
                      }}
                    />
                </div>
              ))}
            </>
          )
        )}
      </div>
    </div>
  );
  
}
