import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Components/login.js'


import LandingPage from './Components/LandingPage'
import HomePage from './Components/HomePage'

import AboutUs from './Components/AboutUs'
import Error from './Components/ErrorPage'
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
          <Route path="about" element={<AboutUs/>}></Route>
          <Route path="*" element={<Error/>}></Route>
          {/*<Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          
  <Route path="*" element={<NoPage />} />*/}
        </Route>

        <Route path="/applicant" element={<Navbar type="user"/>}>
  
            
            <Route path="cvcollection" element={<CVCollectionForm/>}></Route>
            <Route path="formcollection" element={<FormScreening/>}></Route>
            <Route path="*" element={<Error/>}></Route>      


        </Route>

        <Route path="/recruiter" element={<Navbar type="company"/>}>
          
            
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
