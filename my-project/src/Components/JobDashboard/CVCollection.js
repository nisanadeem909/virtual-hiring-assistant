import React, { useEffect, useState } from 'react' 
import './CVScreening.css';
import Footer from '../Footer'
import cvImg from '../images/cvbtn.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CVCollection(props) {

    const navigate = useNavigate();

   const [applications,setApps] = useState([])
   const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
   
   useEffect(() => {
    if (props.job)
    {
        setJob(props.job);
        var param = {'jobId':props.job._id};
        axios.post("http://localhost:8000/komal/getjobapplications",param).then((response) => {
           // alert(JSON.stringify(response.data));
           if (response.data.status == "success"){
              setApps(response.data.jobApps);
            }
            else 
              alert("Error: "+response.data.error);
        })
        .catch(function (error) {
            alert("Axios Error:" + error);
        });
    }
    }, [props.job]);

    const openCV=(path)=>{
        navigate("cvview" ,  {state: path });
    }

    return (
      <div className='kcvcollectionpage-con'>
        <div className='kcvcollectionpage-header'>
            <label className='kcvcollectionpage-header-title'>Applications for {job.jobTitle}</label>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-deadline-div'>
                <label className='kcvcollectionpage-deadline'>{new Date(job.CVDeadline).toLocaleDateString('en-GB')}</label>
                <label className='kcvcollectionpage-deadline-title'>Deadline</label>
            </div>
            <div className='kcvcollectionpage-header-vr'></div>
            <div className='kcvcollectionpage-accScore-div'>
                <label className='kcvcollectionpage-accScore'>{job.AccCVScore.$numberDecimal.toString()}%</label>
                <label className='kcvcollectionpage-accScore-title'>Acceptable Match Score</label>
            </div>
        </div>
        <div className='kcvcollectionpage-inner'>
        {applications.length === 0 ? (
          <label className='kcvcollectionpage-noapps'>No job applications yet</label>
        ) : (
        <table className='kcvcollectionpage-table'>
            <thead className='kcvcollectionpage-table-header'>
                <tr className='kcvcollectionpage-table-header-row'>
                    <th align="center">#</th>
                    <th align="center">Name</th>
                    <th align="center">Email</th>
                    <th align="center">Application Date</th>
                    <th align="center">CV</th>
                </tr>
            </thead>
            <tbody className='kcvcollectionpage-table-body'>
                {applications.map((app,index)=>(
                    <tr className='kcvcollectionpage-table-row'>
                        <td align="center">{index+1}</td>
                        <td align="center">{app.name}</td>
                        <td align="center">{app.email}</td>
                        <td align="center">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                        <td align="center"><button className='kcvcollectionpage-table-cvbtn' onClick={()=>openCV(app)}>View CV<img src={cvImg} className='kcvcollectionpage-table-cvimg'></img></button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
        </div>
      </div>
    )
  }