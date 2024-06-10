import { useNavigate } from 'react-router-dom';
import './formresponses.css';

import React, { useEffect, useState } from 'react' ;
import axios from 'axios';
import Footer from '../Footer';

export default function ShortlistedFormResponsesPage(props) {
    const [resps, setResp] = useState([]);
    const [jobTitle, setJobTitle] = useState();
    const [numberShortlisted, setNumberShortlisted] = useState('None');
    const [questions, setQuestions] = useState([]);

    const getFormResponses = () => {
        var param = { 'jobId': props.job._id };
        axios.post("http://localhost:8000/nabeeha/fetchformresponses", param).then((response) => {
            setResp(response.data.formResponses);
            setQuestions(response.data.formResponses[0]?.answers?.map(answer => answer.question) || []);
        }).catch(function (error) {
            // Handle error
        });
    }

    useEffect(() => {
        setJobTitle(props.job.jobTitle)
        getFormResponses();
    }, []);

    useEffect(() => {
        // Update the number of shortlisted responses whenever resps changes
        const shortlistedCount = resps.filter(app => app.status === 'Shortlisted').length;
        setNumberShortlisted(shortlistedCount);
    }, [resps]);

    return (
        <div className='kcvcollectionpage-con'>
            <div className='kcvcollectionpage-header'>
                <label className='kcvcollectionpage-header-title'>Form Responses for {jobTitle}</label>
                <div className='kcvcollectionpage-header-vr'></div>
                <div className='kcvcollectionpage-deadline-div'>
                    <label className='kcvcollectionpage-deadline'>{resps.length}</label>
                    <label className='kcvcollectionpage-deadline-title'>Received Responses</label>
                </div>
                <div className='kcvcollectionpage-header-vr'></div>
                <div className='kcvcollectionpage-accScore-div'>
                    <label className='kcvcollectionpage-accScore'>{numberShortlisted}</label>
                    <label className='kcvcollectionpage-accScore-title'>Shortlisted Responses</label>
                </div>
            </div>
            <div className='kcvcollectionpage-inner'>
                {resps.length === 0 ? (
                    <p style={{ fontSize: 18 }}>No responses shortlisted yet.</p>
                ) : (
                    <>
                    <br></br>
                    <div className='nabcvcollectionpage-table-container'>
                    <table className='nabcvcollectionpage-table'>
                        <thead className='kcvcollectionpage-table-header'>
                            <tr className='nabcvcollectionpage-table-header-row'>
                                <th align="center">#</th>
                                <th align="center">Email</th>
                                <th align="center">Status</th>
                                {questions.map((quest, index) => (
                                    <th key={index} align="center">{quest}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='kcvcollectionpage-table-body'>
                            {resps &&
                                resps
                                    .sort((a, b) => (a.status === 'Shortlisted' ? -1 : b.status === 'Shortlisted' ? 1 : 0))
                                    .map((app, index) => (
                                        <tr
                                            key={index}
                                            className={`nabcvcollectionpage-table-row ${app.status === 'Shortlisted' ? 'shortlisted' : 'rejected'}`}
                                        >
                                            <td align="center">{index + 1}</td>
                                            <td align="center">{app.applicantEmail}</td>
                                            <td align="center">{app.status}</td>
                                            {app.answers.map((answer, ansIndex) => (
                                                <td key={ansIndex} align="center">{answer.answerStatement}</td>
                                            ))}
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}