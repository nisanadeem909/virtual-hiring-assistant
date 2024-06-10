import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CandidateDetails.css';
import timeicon from './time.png'
import scoreicon from './score.png'
import correcticon from './correct.png'
import incorrecticon from './incorrect.png'
import missingicon from './missing.png'
import axios from 'axios';
import { Radar, Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    LinearScale,
    BarElement,
    CategoryScale,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import BarChart from '../RecruiterVideoResponses/BarChart';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    CategoryScale,
    BarElement,
    LinearScale,
    Filler,
    Tooltip,
    Legend
);

export default function CandidateDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const candidate = location.state.candidate;
    const job = location.state.job; 
    const [questions, setQuestions] = useState([]);  
    const [questionslength, setQuesLen] = useState(0);
    const [resps, setResp] = useState([]);
    const [videoResponse, setVideoResponse] = useState(null);
    const [maxAcceptabilityTraits, setMaxAcceptabilityTraits] = useState(null);
    const [technicalInterviewData, setTechnicalInterviewData] = useState({
        overallScore: "-",
        totalCorrect: "-",
        totalIncorrect: "-",
        timeTaken: "-",
        totalLeft: "-",
        categoryPercentages: {
            'Loading..': 0
        }
    });
    const [time, setTime] = useState("-");
    

    const getFormResponses = () => {
        const param = { 'jobId': job._id }; 
        axios.post("http://localhost:8000/nabeeha/fetchformresponses", param).then((response) => {
            const formResponses = response.data.formResponses;
            const candidateResponses = formResponses.filter(resp => resp.applicantEmail === candidate.email);
            if (candidateResponses.length > 0) {
                setResp(candidateResponses);
                const questionsFromResponse = candidateResponses[0].answers.map(answer => answer.question);
                setQuestions(questionsFromResponse);
                setQuesLen(questionsFromResponse.length);
            }
        })
        .catch((error) => {
            console.error('Error fetching form responses:', error);
        });
    }

    const getVideoResponse = () => {
        const param = { 'jobId': job._id };
        axios.post("http://localhost:8000/nabeeha/fetchvideoresponses", param).then((response) => {
            const videoResponsesC = response.data.responses;
            const candidateResponseV = videoResponsesC.find(response => response.applicantEmail === candidate.email);
            if (candidateResponseV) {
                setVideoResponse(candidateResponseV);
            }
        })
        .catch((error) => {
            console.error('Error fetching video responses:', error);
        });
    };

    const getVideo = () => {
        const param = { 'jobId': job._id };
        axios.post("http://localhost:8000/nabeeha/fetchacceptabilitytraits", param).then((response) => {
            if (response.data && response.data.acceptabilityTraits) {
                setMaxAcceptabilityTraits(response.data.acceptabilityTraits);
            }
        })
        .catch((error) => {
            console.error('Error fetching video responses:', error);
        });
    };

    const fetchTechnicalInterviewData = () => {
        const param = { jobID: job._id, applicantEmail: candidate.email };
        axios.post("http://localhost:8000/nabeeha/fetchtestresponsestats", param)
            .then((response) => {
                setTechnicalInterviewData(response.data);
                const timeTakenSeconds = response.data.timeTaken;
                const formattedTime = timeTakenSeconds < 60 ? `${timeTakenSeconds} seconds` : `${Math.floor(timeTakenSeconds / 60)} minutes`;
                setTime(formattedTime);
            })
            .catch((error) => {
                console.error('Error fetching technical interview data:', error);
            });
    };

    const renderRadarChart = (traits) => {
        const data = {
            labels: traits.map(trait => trait.trait),
            datasets: [
                {
                    label: 'Acceptability Traits Scores',
                    data: traits.map(trait => parseFloat(trait.score?.$numberDecimal || 0)),
                    backgroundColor: 'rgba(34, 202, 236, .2)',
                    borderColor: 'rgba(34, 202, 236, 1)',
                    borderWidth: 2,
                },
                {
                    label: 'Max Acceptability Scores',
                    data: traits.map(trait => {
                        if (maxAcceptabilityTraits && maxAcceptabilityTraits.length > 0) {
                            const maxTrait = maxAcceptabilityTraits.find(maxTrait => maxTrait.trait === trait.trait);
                            return maxTrait ? parseFloat(maxTrait.weight?.$numberDecimal || 0) : 0;
                        } else {
                            return 0; 
                        }
                    }),
                    backgroundColor: 'rgba(255, 99, 132, .2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                },
            ],
        };
    
        const options = {
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    stepSize: 1,
                    pointLabels: {
                        font: {
                            size: 16,
                            weight : 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 16,
                            weight : 'bold'
                        }
                    }
                }
            }
            ,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16, 
                            weight : 'bold',
                            
                        }
                    }
                }
            }
            ,
            layout: {
                padding: {
                    top: 200, 
                    bottom: 200, 
                    left: 180, 
                    right: 180 
                }
            },
            maintainAspectRatio: false, 
            responsive: true,
            width: 200, 
            height: 200 
        };
    
        return <Radar data={data} options={options} />;
    };
    
    

    const handleWatchVideo = (videoUrl, applicantInfo, traitScores) => {  
        navigate('/recruiter/job/candidatedetails/video', { state: { videoUrl, applicantInfo,  traitScores: traitScores} });
      };

    useEffect(() => {
        getFormResponses();
        getVideoResponse();
        getVideo();
        fetchTechnicalInterviewData();
    }, []);

    const openCV = (path) => {
        navigate("cvview", { state: path });
    }

    return (
        <div className="nisa-cd-post-job-container">
            <div className='nisa-candidate-details'>
                <h1 className='nisa-cand-header'>Candidate Overview</h1>
                <div className='nisa-cd-ph-details'>
                    <div className="nisa-cd-phase">
                        <h2 className='nisa-cd-head'>Phase 1: CV Screening</h2>
                        <p className='nisa-p-cv'>Candidate's Percentage: {candidate.CVMatchScore}%</p>
                        <button className="nisa-view-cv-btn" onClick={() => openCV(candidate)}>View CV</button>
                    </div>

                    <div className='nisa-cd-phase'>
                        <h2>Phase 2: Form Screening</h2>
                        <div className='nabcvcollectionpage-table-container'>
                            <table className='nabcvcollectionpage-table'>
                                <thead className='kcvcollectionpage-table-header'>
                                    <tr className='nabcvcollectionpage-table-header-row'>
                                        <th align="center">#</th>
                                        <th align="center">Email</th>
                                        {questions.slice(0, questionslength).map((quest, index) => (
                                            <th key={index} align="center">{quest}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='kcvcollectionpage-table-body'>
                                    {resps.map((app, index) => (
                                        <tr key={index} className='nabcvcollectionpage-table-row'>
                                            <td align="center">{index + 1}</td>
                                            <td align="center">{app.applicantEmail}</td>
                                            {app.answers.map((answer, ansIndex) => (
                                                <td key={ansIndex} align="center">{answer.answerStatement}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='nisa-cd-phase'>
                        <h2 className='nisa-cd-headd'>Phase 3: Video Interview</h2>
                        {videoResponse ? (
                            <div className='video-response'>
                                <p>Overall Score: {videoResponse.overallScore?.$numberDecimal || 'N/A'}/{videoResponse.acceptabilityTraits?.length}</p>
                                
                                <div className='nisa-cd-traits'>
                                    <div className='traits-radar-chart'>
                                        {renderRadarChart(videoResponse.acceptabilityTraits)}
                                    </div>
                                   
                                </div>
                            </div>
                        ) : (
                            <p>No video response available.</p>
                        )}
                    </div>

                    <div className='nisa-cd-phase'>
                    <h2>Phase 4: Technical Interview</h2>
                    <div>
                        <p id="quick-stats">Quick Stats</p>
                        <p><img src={timeicon} alt="icon" style={{ width: "28px", height: "25px" }} /> Test Completed in: {time}</p>
                        <p><img src={scoreicon} alt="icon" style={{ width: "28px", height: "25px" }} /> Test Score: {technicalInterviewData.overallScore} out of {technicalInterviewData.total} Points</p>
                        <p><img src={correcticon} alt="icon" style={{ width: "23px", height: "21px" }} /> Questions correctly attempted: {technicalInterviewData.totalCorrect}</p>
                        <p><img src={incorrecticon} alt="icon" style={{ width: "23px", height: "23px" }} /> Questions incorrectly attempted: {technicalInterviewData.totalIncorrect}</p>
                        <p><img src={missingicon} alt="icon" style={{ width: "25px", height: "18px" }} /> Questions not attempted: {technicalInterviewData.totalLeft}</p>
                    </div>
                    <div className='nisa-cd-B'>
                        <p>Category Breakdown</p>
                        <div className='nisa-cd-bar'>
                        <BarChart data={technicalInterviewData.categoryPercentages} />
                        </div>
                    </div>
                </div>
            </div>
                <button className='nisa-cand-btn' onClick={() => window.history.back()}>Back</button>
            </div>
        </div>
    );
}
