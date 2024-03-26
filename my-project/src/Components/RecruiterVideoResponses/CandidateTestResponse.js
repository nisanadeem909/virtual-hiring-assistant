import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer';
import MessageModal from '../ModalWindows/MessageModal';

export default function CandidateTestResponse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('Loading...');
  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([{ question: [{ type: 'text', text: '' }], options: [''] }]);
  const [answeredQuestions, setAnsweredQuestions] = useState(Array(questions.length).fill(false)); // State to track answered questions
  const [response, setResponse] = useState();
  
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job);
      setEmail(location.state.applicant);
      var param = { job: location.state.job._id };
      axios.post("http://localhost:8000/komal/getjobtest", param)
        .then((response) => {
          if (response.data.status === "success") {
            setQuestions(response.data.form.questions);
            setAnsweredQuestions(Array(response.data.form.questions.length).fill(false)); // Initialize answeredQuestions state
            var param2 = { 'jobID': location.state.job._id, 'email': location.state.applicant };
            axios.post("http://localhost:8000/komal/gettestresponse", param2)
              .then((response) => {
                if (response.data.status === "success") {
                  setResponse(response.data.resp)
                } else {
                  console.log("Error:" + response.data.error);
                  setMessage("Something went wrong, please try again..");
                  setMessageTitle('Error');
                  setOpenModal(true);
                }
              })
              .catch(function (error) {
                console.log("Axios Error:" + error);
                setMessage("Something went wrong, please try again..");
                setMessageTitle('Error');
                setOpenModal(true);
              });

          } else {
            console.log("Error:" + response.data.error);
                  setMessage("Something went wrong, please try again..");
                  setMessageTitle('Error');
                  setOpenModal(true);
          }
        })
        .catch(function (error) {
          console.log("Axios Error:" + error);
                setMessage("Something went wrong, please try again..");
                setMessageTitle('Error');
                setOpenModal(true);
        });
    } else {
      console.log("error");
    }
  }, [location.state]);

  return (<>
    <div className="post-jobnew-container">
      <div className='video-header'>
        <h3 className='nisa-video-heading1'>Attempted Test - {email}</h3>
      </div>
      <hr className='nisa-horizontal-line'></hr>
      <div className="question-list">
        {questions.map((question, index) => (
          <div key={index} className="question-container">
            {question.question.map((questionItem, questionIndex) => (
              <React.Fragment key={questionIndex}>
                <p className='nisa-t-q'>{questionItem.text}</p>
                {questionItem.type === 'image' && (
                  <img className='nisa-t-img' src={`http://localhost:8000/routes/questionimages/` + questionItem.imageUrl} alt="Question" />
                )}
                {questionItem.type === 'code' && (
                  <pre className='nisa-code'>{questionItem.code}</pre>
                )}
              </React.Fragment>
            ))}
            <div className='ktest-answers'>
              <label className={response?.answers.find(ans => ans.questionIndex === index && ans.status === true) ? 'k-correct-answer' : 'k-incorrect-answer'}>
              <b>Candidate's answer:</b> {response?.answers.find(ans => ans.questionIndex === index)?.answer || "No answer provided"}
              </label>
              {response?.answers.find(ans => ans.questionIndex === index && ans.status === false) && (
                <label className='k-actual-answer'><b>Correct answer:</b> {questions[index].answer}</label>
              )}
              {!response?.answers.find(ans => ans.questionIndex === index) && (
                <label className='k-actual-answer'><b>Correct answer:</b> {questions[index].answer}</label>
              )}
            </div>
            <label className='ktest-app-points'>{response?.answers.find(ans => ans.questionIndex === index && ans.status === true) ? `${question.points}/${question.points}` : `0/${question.points}`} Point(s)</label>
          </div>
        ))}
      </div>
      <button className="nisa-submit-button" onClick={() => navigate(-1, { state: { job, 'applicant': email } })}>
        Back
      </button>
    </div>
    <MessageModal
        isOpen={openModal}
        message={message}
        title={messageTitle}
        closeModal={() => {
            setOpenModal(false);
        }}
      />
      <Footer></Footer></>
  );
}
