import React from 'react';
import './CompanyEditProfile.css';
// import home from './finalhome.png';
// import home2 from './hp5.png';
// import Slideshow from './Slideshow';
import Footer from '../Footer.js';
import { useNavigate } from 'react-router-dom';
import profilepic from './personcircle.png'
import { useState,useEffect } from 'react';
import axios from 'axios';
export default function CompanyProfile() {
 // const navigate=useNavigate();
    
    const [serverMessage, setServerMessage] = useState(null);
    const [fullName,setFullName] = useState("Loading..")
   
    const [email,setEmail] = useState("loading..") 
    // const [contact,setContact] = useState("1234-567890") 
    const [jobDes,setJobDes] = useState("Loading..")  
 
    const [username,setUsername] = useState("") // this will be replaced by session username
    

    const [img,setImg] = useState('./personcircle.png'); //this is the default profilepic
    const [imgSet,setImgSet] = useState("false")

    const [oldImg, setOldImg] = useState('./personcircle.png'); // Old image
    useEffect(()=>{

        const sessionID = sessionStorage.getItem('sessionID');
        setUsername(sessionID)

        let param = {"username":sessionID}; 
        
        axios.post(`http://localhost:8000/nabeeha/editprofile-getdetails-company`,param).then(res => {
        //   setCons(res.data);
            if (res.data.user){
               
                setFullName(res.data.user.companyname)
                setEmail(res.data.user.email)
                // setContact(res.data.user.contact)
                setJobDes(res.data.user.username)
              
                if (res.data.user.profilePic){
                    setImg(res.data.user.profilePic)
                    
                    setOldImg(res.data.user.profilePic)
                }

                // alert("img= " +img)
                // alert("oldimg= " + oldImg)
            }
           
          
      })
      .catch(
         error => alert(error)
        
      );
    
      },[])

      const handleInputChange = (e) => {
        // Handle input changes and update state accordingly
        const { name, value } = e.target;
        switch (name) {
            case 'fullname':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            // case 'contact':
            //     setContact(value);
            //     break;
            case 'jobDes':
                setJobDes(value);
                break;
            default:
                break;
        }
    };

    const handleSave = async (username1) => {

        if (!fullName || !email || !jobDes || !fullName.trim() || !email.trim() || !jobDes.trim())
        {
            setServerMessage({message: "Please fill all fields!", isError: true})
            return;
        }

        const updatedDetails = {
            companyname: fullName,
            email
        };

        try {
            const response = await axios.post(`http://localhost:8000/nabeeha/editprofile-updatedetails-company`, {
                username,
                updatedDetails,
            });

            setServerMessage({ message: response.data.message, isError: false });

            setTimeout(() => {
                setServerMessage(null);
            }, 5000);
        } catch (error) {
            console.error(error);
            // alert('Error saving user details');

            setServerMessage({ message: 'Error saving user details', isError: true });

            setTimeout(() => {
                setServerMessage(null);
            }, 5000);
        }
        
        

        if (imgSet == "true"){
            // alert(img.name)
            upload(username1)
            let param = {"username":username}; 
            axios.post(`http://localhost:8000/nabeeha/getprofilepic-company`,param).then(res => {
            //   setCons(res.data);
            
               
            
            
                })
                .catch(
                    // error => alert(error)
                );

            setImgSet("false")

        }
        
    };

    const upload = (username1) =>{

        // const uname = sessionStorage.getItem("sessionID");
        // const utype = sessionStorage.getItem("userType");
  
        if (img)
        {
          var fdata = new FormData();
          fdata.append("Image", img);
          fdata.append("username", username1); //THIS SHOULD BE FROM STATE
          axios.post('http://localhost:8000/nabeeha/uploadprofilepic-company',fdata)
          .then(res => {
            // alert("Respnse" + JSON.stringify(res.data))
            setOldImg(img.name)
           
        })
          .catch(
            err=>{
                // alert("ERROR IN UPLOADAXIOS : "+err)
            });
        }

        
         
    }
    const HandleUpload=(t)=>{
        //console.log(t.handle.files);
     
        setImg(t.target.files[0]);
       
       
        // alert("setting image=" + img)
        setImgSet("true")
       
        

      }
 return (
    <div>
        <div id="nab-profile-outer-div">
            <div id="nab-profile-pic">
                        {/* <img id="nab-pic-circle" src={profilepic}></img> */}
                        <img id="nab-pic-circle" src={`http://localhost:8000/routes/profilepictures/` + ( oldImg || {profilepic})} />

                        <div className="profile-info">
                            <div> 
                                
                                {/* <button id="change-prof-pic">Upload Picture</button> */}
                                {/* <label>Upload Pic</label> */}
                                <input id="displaynone" type="file" onChange={HandleUpload}></input>
                            </div>
                            <br></br>
                            <div className="profile-name">{fullName}</div>
                            <div className="profile-email">{email}</div>
                        </div>
                      
            </div>
            <div id="nab-profile-details">
                    <label id="profile-settings">Profile Settings</label>
                    <hr></hr>
                    <div className="profile-field-firstname">
                        <label id="nab-profile-label" htmlFor="fullname">Full Name</label>
                        <input
                        type="text"
                        id="nab-profile-input"
                        name="fullname"
                        value={fullName}
                        onChange={handleInputChange}
                    />
                        
                    </div>
                    
                    <div className="profile-field">
                        <label id="nab-profile-label" htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="nab-profile-input-email"
                            name="email"
                            value={email}
                            
                        />
                    </div>
                    {/* <div className="profile-field">
                        <label id="nab-profile-label" htmlFor="contact">Contact Number</label>
                        <input
                            type="text"
                            id="nab-profile-input"
                            name="contact"
                            value={contact}
                            onChange={handleInputChange}
                            
                        />
                    </div> */}
                    <div className="profile-field">
                            <label id="nab-profile-label" htmlFor="jobDes">Username</label>
                            <input
                                type="text"
                                id="nab-profile-input"
                                name="jobDes"
                                value={jobDes}
                                
                            />
                    </div>
                {/* New label to display server message */}
                {serverMessage && (
                        <label style={{ color: serverMessage.isError ? 'red' : 'green' }}>
                            {serverMessage.message}
                        </label>
                    )}
                    <button type="submit" id="nab-profile-button" onClick={() => handleSave(username)}>Save</button>
            </div>

            
        </div>
        
         <div className="ft"> <Footer />        </div> 

        
    </div>
  );
}