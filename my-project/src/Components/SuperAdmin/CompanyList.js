import React, { useState, useEffect } from 'react';
import './CompanyList.css';
import '../AdminHome/AdminHome.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ModalWindows/ConfirmRequestModal';

const person = "personcircle.png"

export default function CompanyList() {
  const tabs = ["Company Registration Requests", "Registered Companies"];
  const [activeTab, setActiveTab] = useState(0);

  const [companies, setCompanies] = useState([]);
  const [companyRequests, setCompanyReqs] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState([]);
  const [openModal2, setOpenModal2] = useState([]);
  const [errStatus, setErrStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 0) {
          const response = await axios.post('http://localhost:8000/komal/getcompanyrequests');
          if (response.data.status === "success") {
            setErrStatus(false);
            setCompanyReqs(response.data.reqs);
            setOpenModal(Array(response.data.reqs.length).fill(false));
            setOpenModal2(Array(response.data.reqs.length).fill(false));
          } else {
            console.log('Error:', response.data.error);
            setErrStatus(true);
          }
        } else {
          const response = await axios.post('http://localhost:8000/komal/getcompanies');
          if (response.data.status === "success") {
            setErrStatus(false);
            setCompanies(response.data.data);
          } else {
            console.log('Error:', response.data.error);
            setErrStatus(true);
          }
        }
      } catch (error) {
        console.error('Axios error:', error);
        setErrStatus(true);
      }
    };

    fetchData();
  }, [activeTab]);

  const setModalOpen = (index, value) => {
    var copy = [...openModal];
    copy[index] = value;
    setOpenModal(copy);
  };

  const setModal2Open = (index, value) => {
    var copy = [...openModal2];
    copy[index] = value;
    setOpenModal2(copy);
  };

  const approveRequest=(index)=>{
    //approveCompanyRequest
    var param = {'_id':companyRequests[index]._id};
        axios.post("http://localhost:8000/komal/approveCompanyRequest",param).then((response) => {
          if (response.data.status !== "success") {
            console.log(JSON.stringify(response.data.error));
            setErrStatus(true);
          } else {
            setErrStatus(false);
            var copy = [...companyRequests];
            copy.splice(index, 1);
            setCompanyReqs(copy);
          
            setOpenModal(copy.map(() => false));
          }
        })
        .catch(function (error) {
          console.log("Axios error: " + error);
          setErrStatus(true);
        });
  }

  const disapproveRequest=(index)=>{
    //approveCompanyRequest
    var param = {'_id':companyRequests[index]._id};
        axios.post("http://localhost:8000/komal/disapproveCompanyRequest",param).then((response) => {
          if (response.data.status !== "success") {
            console.log(JSON.stringify(response.data.error));
            setErrStatus(true);
          } else {
            setErrStatus(false);
            var copy = [...companyRequests];
            copy.splice(index, 1);
            setCompanyReqs(copy);
          
            setOpenModal2(copy.map(() => false));
          }
        })
        .catch(function (error) {
          console.log("Axios error: " + error);
          setErrStatus(true);
        });
  }

  return (
    <div>
      <div className='kom-companylist-con'>
        {errStatus ? (
          <div className='k-companylist-error-message'>Something went wrong, please try again..</div>
        ) : (
          <>
            <div className='k-companylist-tabs'>
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`k-companylist-tab ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className='kcompanylist-div'>
              {activeTab === 0 ? (
                companyRequests.length === 0 ? (
                  <div className='k-companylist-error-message'>No registration requests.</div>
                ) : (
                  <>
                    {companyRequests.map((rec, index) => (
                      <div key={index} className="k-company-row">
                  <div className="k-company-details">
                    <div className='k-company-recdiv' >
                      <div>
                        <div className="k-company-title">{ rec.companyname+ ' ' + '@' + rec.username}</div>
                        <div className="k-company-status">
                          {rec.email}
                        </div>
                      </div>
                  </div>
                    </div>
                    <button className="open-k-company-button" onClick={() => setModalOpen(index, true)}>Approve</button>
                    <button className="open-k-company-button" onClick={() => setModal2Open(index, true)}>Disapprove</button>
                    <ConfirmModal
                      isOpen={openModal[index]}
                      title={'Approve Company'}
                      message={'Are you sure you want to register the company '+rec.companyname+' ?'}
                      value={index}
                      removeValue={approveRequest}
                      closeModal={() => {
                        setModalOpen(index, false);
                      }}
                    /><ConfirmModal
                      isOpen={openModal2[index]}
                      title={'Disapprove Company'}
                      message={'Are you sure you want to disapprove the registration request for '+rec.companyname+' ?'}
                      value={index}
                      removeValue={disapproveRequest}
                      closeModal={() => {
                        setModal2Open(index, false);
                      }}
                    />
                </div>
                    ))}
                  </>
                )
              ) : (
                companies.length === 0 ? (
                  <div className='k-companylist-error-message'>No registered companies.</div>
                ) : (
                  <>
                    {companies.map((rec, index) => (
                      <div key={index} className="k-company-row">
                          <div className="k-company-details">
                        <div className='k-company-recdiv' >
                        <img className='k-rec-profilepic' src={`http://localhost:8000/routes/profilepictures/${rec.profilePic || person}`} alt="Profile"></img>
                          <div>
                            <div className="k-company-title">{rec.companyname}</div>
                            <div className="k-company-status">{'@'+rec.username}</div>
                          </div>
                      </div>
                            
                        </div>
                        <div className="k-company-email">
                              {rec.email}
                            </div></div>
                    ))}
                  </>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
