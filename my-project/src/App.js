import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Components/login.js'


import LandingPage from './Components/LandingPage'
import RecruiterProjile from './Components/RecruiterHome/RecruiterHomePage.js';
import HomePage from './Components/HomePage'
import Signup from './Components/Signup'
import AboutUs from './Components/AboutUs'
import Error from './Components/ErrorPage'
import PostJobPage from './Components/PostJob/PostJobPage.js';
import RejectionEmailPage from './Components/Email_Notif/RejectionEmailPage.js'
import NotificationPage from './Components/Email_Notif/NotificationPage.js'
import CreateFormPageNew from './Components/FormScreening/CreateFormPageNew.js'
import JobDashboardPage from './Components/JobDashboard/JobDashboardPage.js';


import CVCollectionForm from './Components/ApplicantCVForm/cvcollectionform.js'
import FormScreening from './Components/ApplicantFormScreening/formscreening.js'
import RecruiterProfile from './Components/RecruiterProfile/profile.js'
import FormCollectionEmail from './Components/RecruiterPhase2Email/FormCollectionEmailPage.js'
import FormResponsesPage from './Components/RecruiterFormResponses/formresponses.js';
import ShortlistedFormResponsesPage from './Components/RecruiterFormResponses/shortlistedformresponses.js';

function App() {
  return (
   
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login/>}></Route>
          <Route path="signup" element={<Signup/>}></Route>
          <Route path="about" element={<AboutUs/>}></Route>
          <Route path="*" element={<Error/>}></Route>
        </Route>

        <Route path="/applicant" element={<Navbar type="user"/>}>
  
            
            <Route path="cvcollection" element={<CVCollectionForm/>}></Route>
            <Route path="formcollection" element={<FormScreening/>}></Route>
            <Route path="*" element={<Error/>}></Route>      


        </Route>

        <Route path="/recruiter" element={<Navbar type="company"/>}>
          
            <Route path="home" element={<RecruiterProjile/>}></Route>
            <Route path="job/rejectionemail" element={<RejectionEmailPage/>}></Route>
            <Route path="notifications" element={<NotificationPage/>}></Route>
            <Route path="job/createform" element={<CreateFormPageNew/>}></Route>
            <Route path="job" element={<JobDashboardPage/>}></Route>
            <Route path="postjob" element={<PostJobPage/>}></Route>
            <Route path="profile" element={<RecruiterProfile/>}></Route>
            <Route path="phase2email" element={<FormCollectionEmail/>}></Route>
            <Route path="phase1responses" element={<FormResponsesPage/>}></Route>
            <Route path="shortlistedphase1responses" element={<ShortlistedFormResponsesPage/>}></Route>

            <Route path="*" element={<Error/>}></Route>
            
            

          
        </Route>

      </Routes>
    </BrowserRouter>
    /*
    <div className="App">
      <LandingPage/>
        
    </div>*/

 );
}

export default App;
