import React, { useState, useEffect } from 'react';
import '../RecruiterHome/RecruiterHomePage.css';
import AdminProjile from './AdminProjile';
import AddRecruiter from './AddRecruiterLink';
import Footer from '../Footer';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import RecruiterList from './RecruitersList';

export default function AdminHomePage() {
  const [AdminData, setAdminData] = useState(null);
//   const location = useLocation();

  useEffect(() => {
    //if (location && location.state && location.state.sessionID) {
        //alert(sessionStorage.getItem("sessionID"));
      if (sessionStorage.getItem("sessionID")){
      const sessionID = sessionStorage.getItem("sessionID");

      axios.get(`http://localhost:8000/nisa/company/${sessionID}`)
        .then(res => {
          const data = res.data;
          setAdminData(data);
          //alert(JSON.stringify(data));
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      console.error("SessionID not found");
    }
  }, []);

  return (
    <div className="grid-container">
      <div className="profile-box">
        {AdminData && <AdminProjile data={AdminData}></AdminProjile>}
      </div>

     <div className="post-job"> 
        <AddRecruiter></AddRecruiter>
      </div>


      <div className="job-list"> 
        <RecruiterList data={AdminData}></RecruiterList>
      </div>

      <div className="uh_footer">
        <Footer />
      </div>
    </div>
  );
}
