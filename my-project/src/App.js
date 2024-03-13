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
import VideoInterviewQuestionPage from './Components/JobDashboard/VideoInterviewQuestionPage.js'

import CVCollectionForm from './Components/ApplicantCVForm/cvcollectionform.js'
import FormScreening from './Components/ApplicantFormScreening/formscreening.js'
import RecruiterProfile from './Components/RecruiterProfile/profile.js'
import ChangePasswordPage from './Components/RecruiterProfile/changepassword.js'

import FormCollectionEmail from './Components/RecruiterPhase2Email/FormCollectionEmailPage.js'
import FormResponsesPage from './Components/RecruiterFormResponses/formresponses.js';
import ShortlistedFormResponsesPage from './Components/RecruiterFormResponses/shortlistedformresponses.js';
import SetEmail from './Components/PostJob/SetEmail.js';
import CVView from './Components/JobDashboard/CVViewPage.js';
import EditFormPage from './Components/FormScreening/EditFormPage.js';
import AdminHomePage from './Components/AdminHome/AdminHomePage.js';
import CompanySignup from './Components/CompanySignup/CompanySignup.js';
import CompanyProfile from './Components/AdminHome/CompanyEditProfile.js';
import SuperAdminHomePage from './Components/SuperAdmin/SuperAdminHome.js';
import ApplicantVideoTestLogin from './Components/ApplicantVideo/ApplicantVideoTestLogin.js';
import IntroductionPage from './Components/ApplicantVideo/IntroductionPage.js';
import VideoForm from './Components/ApplicantVideo/VideoForm.js';
import TechnicalTest from './Components/ApplicantVideo/TechnicalTest.js';
import TestDone from './Components/ApplicantVideo/TestDone.js';
import MakeTest from './Components/RecruiterTechTest/CreateTestPage.js';
import EditTest from './Components/RecruiterTechTest/EditTestPage.js';

import VideoPage from './Components/JobDashboard/VideoPage.js'

import VideoEditPage from './Components/JobDashboard/VideoEditPage.js';
import VideoEditBtn from './Components/JobDashboard/VideoEditBtn.js';

function App() {
  return (
   
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login/>}></Route>
          {/*<Route path="signup" element={<Signup/>}></Route>*/}
          <Route path="about" element={<AboutUs/>}></Route>
          <Route path="companysignup" element={<CompanySignup/>}></Route>
          <Route path="*" element={<Error/>}></Route>
        </Route>

        <Route path="/company" element={<Navbar type="company"/>}>

            

          <Route index element={<AdminHomePage/>} />
          <Route path="addrecruiter" element={<Signup/>}></Route>
          <Route path="profile" element={<CompanyProfile/>}></Route>
            <Route path="changepasswordpage" element={<ChangePasswordPage/>}></Route>
          <Route path="*" element={<Error/>}></Route>      


        </Route>
        <Route path="/admin" element={<Navbar type="admin"/>}>

            

          <Route index element={<SuperAdminHomePage/>} />
            <Route path="changepasswordpage" element={<ChangePasswordPage/>}></Route>
          <Route path="*" element={<Error/>}></Route>      


        </Route>

        <Route path="/applicant" element={<Navbar type="applicant"/>}>
        <Route index element={<Error/>} />
        <Route path="cvcollection/:cvcollectionid" element={<CVCollectionForm />} />
        <Route path="formcollection/:formcollectionid" element={<FormScreening />} />
        <Route path="videointerview/:interviewid" element={<ApplicantVideoTestLogin />} />
        <Route path="videointerview/:interviewid/intropage" element={<IntroductionPage/>} />
        <Route path="videointerview/:interviewid/intropage/video" element={<VideoForm/>} />
        <Route path="videointerview/:interviewid/intropage/video/test" element={<TechnicalTest/>} />
        <Route path="videointerview/:interviewid/intropage/video/test/done" element={<TestDone/>} />
        <Route path="*" element={<Error/>} />
      </Route>




        <Route path="/recruiter" element={<Navbar type="recruiter"/>}>
          
            <Route path="home" element={<RecruiterProjile/>}></Route>
            <Route path="home/postjob/rejectionemail" element={<RejectionEmailPage/>}></Route>
            <Route path="notifications" element={<NotificationPage/>}></Route>
            <Route path="job/createform" element={<CreateFormPageNew/>}></Route>
            <Route path="job/editform" element={<EditFormPage/>}></Route>
            <Route path="job/videointerviewquestionpage" element={<VideoInterviewQuestionPage/>}></Route>
            <Route path="job" element={<JobDashboardPage/>}></Route>
            <Route path="job/cvview" element={<CVView/>}></Route>
            <Route path="home/postjob" element={<PostJobPage/>}></Route>
            <Route path="profile" element={<RecruiterProfile/>}></Route>
            <Route path="changepasswordpage" element={<ChangePasswordPage/>}></Route>
            <Route path="job/createform/phase2email" element={<FormCollectionEmail/>}></Route>
            <Route path="job/maketest" element={<MakeTest/>}></Route>
            <Route path="job/edittest" element={<EditTest/>}></Route>

            <Route path="job/video" element={<VideoPage />} />

            <Route path="job/editvideobtn" element={<VideoEditBtn/>}></Route>
            <Route path="job/editvideobtn/editvideo" element={<VideoEditPage/>}></Route>


            
            
            

            
           


            <Route path="*" element={<Error/>}></Route>
            
            

          
        </Route>

      </Routes>
    </BrowserRouter>

 );
}

export default App;
