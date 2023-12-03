import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Components/login.js'


import LandingPage from './Components/LandingPage'
import HomePage from './Components/HomePage'

import AboutUs from './Components/AboutUs'
import Error from './Components/ErrorPage'

import RejectionEmailPage from './Components/Email_Notif/RejectionEmailPage.js'
import NotificationPage from './Components/Email_Notif/NotificationPage.js'
import CreateFormPageNew from './Components/FormScreening/CreateFormPageNew.js'



function App() {
  return (
   
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login/>}></Route>
          <Route path="about" element={<AboutUs/>}></Route>
          <Route path="*" element={<Error/>}></Route>
        </Route>

        <Route path="/applicant" element={<Navbar type="user"/>}>
  
            <Route path="*" element={<Error/>}></Route>
                   


        </Route>

        <Route path="/recruiter" element={<Navbar type="company"/>}>
          
            
            <Route path="job/rejectionemail" element={<RejectionEmailPage/>}></Route>
            <Route path="notifications" element={<NotificationPage/>}></Route>
            <Route path="job/createform" element={<CreateFormPageNew/>}></Route>
            
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
