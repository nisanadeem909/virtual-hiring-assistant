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
import SetEmail from './Components/PostJob/SetEmail.js';
import CVView from './Components/JobDashboard/CVViewPage.js';
import EditFormPage from './Components/FormScreening/EditFormPage.js';

function App() {
  return (
   
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login/>}></Route>
          {/*<Route path="signup" element={<Signup/>}></Route>*/}
          <Route path="about" element={<AboutUs/>}></Route>
          <Route path="*" element={<Error/>}></Route>
        </Route>

        <Route path="/admin" element={<Navbar type="admin"/>}>

            

          <Route index element={<Error/>} />
          <Route path="addrecruiter" element={<Signup/>}></Route>
          <Route path="profile" element={<RecruiterProfile/>}></Route>
          <Route path="*" element={<Error/>}></Route>      


        </Route>

        <Route path="/applicant" element={<Navbar type="applicant"/>}>

            

            <Route index element={<Error/>} />
          <Route path="cvcollection/:cvcollectionid" element={<CVCollectionForm/>}></Route>
            <Route path="formcollection/:formcollectionid" element={<FormScreening/>}>
              {/* <Route index element={<FormScreening/>} />
              <Route path=":formId" element={<FormScreening/>} /> */}
            </Route>

            <Route path="*" element={<Error/>}></Route>      


        </Route>

        <Route path="/recruiter" element={<Navbar type="recruiter"/>}>
          
            <Route path="home" element={<RecruiterProjile/>}></Route>
            <Route path="home/postjob/setemail/rejectionemail" element={<RejectionEmailPage/>}></Route>
            <Route path="notifications" element={<NotificationPage/>}></Route>
            <Route path="job/createform" element={<CreateFormPageNew/>}></Route>
            <Route path="job/editform" element={<EditFormPage/>}></Route>
            <Route path="job" element={<JobDashboardPage/>}></Route>
            <Route path="job/cvview" element={<CVView/>}></Route>
            <Route path="home/postjob" element={<PostJobPage/>}></Route>
            <Route path="profile" element={<RecruiterProfile/>}></Route>

            
            
            

            <Route path="home/postjob/setemail" element={<SetEmail/>}></Route>
            <Route path="home/postjob/setemail/phase2email" element={<FormCollectionEmail/>}></Route>
            
           


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
