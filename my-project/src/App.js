import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Components/login.js'


import LandingPage from './Components/LandingPage'
import HomePage from './Components/HomePage'
import Signup from './Components/Signup'
import AboutUs from './Components/AboutUs'
import Error from './Components/ErrorPage'


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
          {/*<Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          
  <Route path="*" element={<NoPage />} />*/}
        </Route>

        <Route path="/applicant" element={<Navbar type="user"/>}>
  
            <Route path="*" element={<Error/>}></Route>
                   


        </Route>

        <Route path="/recruiter" element={<Navbar type="company"/>}>
          
            
            
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
