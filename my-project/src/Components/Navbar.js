import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import logo2 from './vhalogo.png';
import nabhumanicon from './personcircle.png';
import nablogouticon from './nab-logout-icon.png';
import changepasswordicon from './changepassword1.png';
import nabprofileicon from './nab-profile-icon.png';
import axios from "axios";
import { useEffect } from "react";
import MessageModal from './ModalWindows/MessageModal';

const person = 'personcircle.png';

const Layout = (props) => {

  const navigate = useNavigate(); 
  const [img1,setImg1] = useState();
  const [currUser,setUser] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(()=>{
      if (props.type == "recruiter" && !sessionStorage.getItem("sessionID"))
      {
        navigate('/login');
      }
      else if (props.type == "admin" && !sessionStorage.getItem("sessionID"))
        navigate('/login');
  },[])

  const findUser=()=>{
    //alert("HELLLOOOO")
    if (props.type == "recruiter" || props.type == "admin")
    {
        var sessionID = sessionStorage.getItem('sessionID');
        axios.get(`http://localhost:8000/nisa/recruiter/${sessionID}`)
            .then(res => {
              const data = res.data;
              setUser(data);
            })
            .catch(err => {
              console.error(err);
            });
    }
  }
  

  useEffect(()=>{
    findUser();
    const intervalId = setInterval(findUser, 10000);
    return () => clearInterval(intervalId);
},[props])

  const logoutSession = () =>{ 

      axios.get('http://localhost:8000/komal/logout')
        .then(response => {
        
          sessionStorage.removeItem("sessionID");

          navigate("/login");
        })
        .catch(error => {
          console.error('Error logging out:', error);
          setOpenModal(true);
        });
  }

  const handleProfile = () =>{
    document.getElementById("myDropdown").classList.toggle("show");
  }

  var navlayout = 
    <ul className="navb_ul">
          <li className="navb_li">
            <Link to="/">Home</Link>
          </li>
          <li className="navb_li">
            <Link to="/about">About</Link>
          </li>
          <li className="navb_li">
            <Link to="/login">Login</Link>
          </li>
        </ul>;

  if (props.type)
  {
    if (props.type == "applicant")
    {
      navlayout = <></>;
    }
    else if (props.type == "admin")
    {
      navlayout = <ul className="navb_ul">
      <li className="navb_li">
        <Link to='/admin'>Home</Link>
      </li>
      <li className="navb_li">
        <div class="nab-dropdown" >
           
        <button class="nab-dropbtn" onClick={handleProfile}>
           Profile
            
          </button>
          
           <div class="nab-dropdown-content" id="myDropdown">
           <div id="nab-dropdown-items">
                <div id="profile-head-section">
                  <img src={`http://localhost:8000/routes/profilepictures/${currUser.profilePic || person}`} id="nab-human-icon"></img> 
                  <label className='knav-username'>{sessionStorage.getItem("sessionID")}</label>
                  
                </div>
                <div id="profile-line-hr"></div>
                <div id="profile-head-section">
                  <button class="editprofile-button" onClick={()=>navigate('/admin/profile')}><img src={nabprofileicon} id="nab-profile-icon"></img> My Profile</button>
                  
                </div>
                <div id="profile-head-section">
                                  
                                  <button onClick={()=>navigate('/admin/changepasswordpage')} class="editprofile-button" >
                                  <img src={changepasswordicon} id="nab-logout-icon"></img> <span>Change Password</span></button>
                                  
                                </div>
                <div id="profile-head-section">
                  
                  <button onClick={logoutSession} class="editprofile-button" >
                  <img src={nablogouticon} id="nab-logout-icon"></img> <span>Logout </span></button>
                  
                </div>
                
                  
                
              </div>
              
          </div>

        </div>

      </li>
  </ul>;
    }
    else if (props.type == "recruiter")
    {
      navlayout = <ul className="navb_ul">
                      <li className="navb_li">
                        <Link to='/recruiter/home'>Home</Link>
                      </li>
                      <li className="navb_li">
                        <Link to='/recruiter/notifications'>Notifications</Link>
                      </li>
                      <li className="navb_li">
                        <div class="nab-dropdown" >
                           
                        <button class="nab-dropbtn" onClick={handleProfile}>
                           Profile
                            
                          </button>
                          
                           <div class="nab-dropdown-content" id="myDropdown">
                           <div id="nab-dropdown-items">
                                <div id="profile-head-section">
                                  <img src={`http://localhost:8000/routes/profilepictures/${currUser.profilePic || person}`} id="nab-human-icon"></img> 
                                  <label className='knav-username'>{sessionStorage.getItem("sessionID")}</label>
                                  
                                </div>
                                <div id="profile-line-hr"></div>
                                <div id="profile-head-section">
                                  <button class="editprofile-button" onClick={()=>navigate('/recruiter/profile')}><img src={nabprofileicon} id="nab-profile-icon"></img> My Profile</button>
                                  
                                </div>
                                <div id="profile-head-section">
                                  
                                  <button onClick={()=>navigate('/recruiter/changepasswordpage')} class="editprofile-button" >
                                  <img src={changepasswordicon} id="nab-logout-icon"></img> <span>Change Password</span></button>
                                  
                                </div>
                                <div id="profile-head-section">
                                  
                                  <button onClick={logoutSession} class="editprofile-button" >
                                  <img src={nablogouticon} id="nab-logout-icon"></img> <span>Logout </span></button>
                                  
                                </div>
                                
                                  
                                
                              </div>
                              
                          </div>

                        </div>

                      </li>
                  </ul>;
    }
  }

  return (
    <>
      <nav>
      <input type="checkbox" id="navb_check"/>
      <label for="navb_check" class="navb_checkbtn">
        <i class="navb_fas navb_fa-bars"></i>
      </label>
      <img class="navb_logo" src={logo2}/>
        {navlayout}
      </nav>

      <Outlet /><MessageModal
        isOpen={openModal}
        message={"Something went wrong, please try again..."}
        title={"Error"}
        closeModal={() => {
            setOpenModal(false);
        }}
      />
    </>
  )
};

export default Layout;
  