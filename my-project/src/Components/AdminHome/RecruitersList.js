import React, { useState, useEffect } from 'react';
import '../RecruiterHome/JobList.css';
import './AdminHome.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RemoveModal from '../ModalWindows/ConfirmRemoveModal';

const person = "personcircle.png"

export default function RecruiterList() {
  const [recruiters, setRecruiters] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState([]);

  useEffect(() => {
    axios.post('http://localhost:8000/komal/getrecruiters') 
      .then(response => {
        if (response.data.status == "success"){
            setRecruiters(response.data.recs);
            const modalArray = new Array(response.data.recs.length).fill(false);
            setOpenModal(modalArray);
        }
        else
        alert('Error:', response.data.error)
    }).catch(error => alert('Axios Error:', error));
  }, []);

  const removeRecruiter=(index)=>{
    var param = {'username':recruiters[index].username};
    axios.post("http://localhost:8000/komal/removerecruiter",param).then((response) => {
           // alert(JSON.stringify(response.data));
            if (response.data.status != "success"){
                alert(JSON.stringify(response.data.error))}
            })
            .catch(function (error) {
                alert("Axios error: "+error)
            });

    var copy = [...recruiters];
    copy.splice(index, 1);
    setRecruiters(copy);

    setOpenModal(false);
  }

  const setModalOpen=(index,value)=>{
    var copy = [...openModal];
    copy[index] = value;
    setOpenModal(copy);
  }

  return (
    <div>
      <div className='nisa-joblist-con'>
        <h2 className='nisa-joblists-head'>
          Recruiter List
        </h2>
        {recruiters.map((rec, index) => (
          <div key={index} className="job-row">
            <div className="job-details">
              <div className='k-recdiv' >
                <img className='k-rec-profilepic' src={`http://localhost:8000/routes/profilepictures/${rec.profilePic || person}`}></img>
                <div>
                <div className="job-title">{rec.name}</div>
                <div className="job-status">
                  {rec.email}
                </div>
                </div>
              </div>
            </div>
            <button className="open-job-button" onClick={()=>setModalOpen(index,true)}>Remove Recruiter</button>
            <RemoveModal
                isOpen={openModal[index]}
                title={rec.username}
                value={index}
                removeValue={removeRecruiter}
                closeModal={() => {
                    setModalOpen(index,false);
                }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
