import React, { useState, useEffect } from 'react';
import './CompanyList';
import Footer from '../Footer';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CompanyList from './CompanyList';
//import CompanyList from './CompanyList';

export default function SuperAdminHomePage() {
  const [AdminData, setAdminData] = useState(null);
//   const location = useLocation();

  useEffect(() => {
    //if (location && location.state && location.state.sessionID) {
        //alert(sessionStorage.getItem("sessionID"));
      if (sessionStorage.getItem("sessionID")){
      const sessionID = sessionStorage.getItem("sessionID");

      axios.get(`http://localhost:8000/nisa/admin/${sessionID}`)
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
    <div className="kgrid-container">

     <div className="company-list"> 
        <CompanyList data={AdminData}></CompanyList>
      </div>

      <div className="uh_footer">
        <Footer />
      </div>
    </div>
  );
}
