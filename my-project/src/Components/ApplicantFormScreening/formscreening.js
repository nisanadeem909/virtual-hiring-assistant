import React from 'react';
import './formscreening.css';
import Footer from '../Footer.js';
import success from './success.png'
import { useNavigate,useParams } from 'react-router-dom';
import FormQuestion from './formquestion.js'
import { useState, useEffect } from 'react';
import erroricon from './images.png'
import axios from 'axios';

export default function FormScreening() {
 // const navigate=useNavigate();

  const navigate=useNavigate();
  const { formcollectionid } = useParams();


  const [jobrole,setJobRole] = useState("Associate Software Engineer")
  const [jobID,setJobID] = useState('')
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState('');
  const [incompleteFormError,setIncompleteFormError] = useState('')
  const [isJobAcceptingResponses, setIsJobAcceptingResponses] = useState(true);


  const[jobDeadline,setJobDeadline] = useState('')

  useEffect(() => {
    
    setJobID(formcollectionid);

    axios.post(`http://localhost:8000/nabeeha/getjobdetailsforformcollection`, {"jobID": formcollectionid})
      .then(res => { 
        if (!res.data.job) //Job does not exist
        {
          setErrorMessage("Job does not exist." );
          return
        }
        if (res.data.job.status != 2){ //Job exists but it is Phase 1 CV Screening
          alert("Job status error")
          setErrorMessage("We are not currently accepting responses for this role" );
          return
        }
        
        if (!res.data.form) //Job exists and it is in Phase 2 but form has not been created.
        {
          alert("Form does not exist error")
          setErrorMessage("We are not currently accepting responses for this role" );
          return
        }
        if (res.data.job && res.data.form) {
          setJobRole(res.data.job.jobTitle);
          setQuestions(res.data.form.questions);

          const currentDate = new Date();
          const formDeadline = new Date(res.data.job.P2FormDeadline);
          
          
          //Phase 1 deadline has passed.
          setIsJobAcceptingResponses(currentDate <= formDeadline);

          
          const originalDate = new Date(res.data.job.P2FormDeadline);

          // Get day, month, and year components
          const day = originalDate.getDate();
          const month = originalDate.getMonth() + 1; // Month is zero-based, so add 1
          const year = originalDate.getFullYear();

          // Format the date as dd-mm-yyyy
          const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

          // Now, 'formattedDate' contains the date in the "dd-mm-yyyy" format
          console.log(formattedDate);
          setJobDeadline(formattedDate)
        } else {
          setErrorMessage(res.data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('An error occurred while fetching job details.');
      });

    if (errorMessage) {
      //alert(errorMessage);
      navigate('/error');
    }
  }, [errorMessage, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if all questions are answered
    for (let i = 0; i < questions.length; i++) {
      const answer = userAnswers[i];
      //alert(answer);
      if (answer === null || answer === undefined) {
        setIncompleteFormError(`Please answer ALL questions.`);
        
        return;
      }
    }
    const answerObject = questions.map((question, index) => ({
      // questionID: question._id,
      question: question.question, 
      answerStatement: userAnswers[index] || null,
    }));

    const formData = {
      email: userEmail,
      jobID: jobID,
      answers: answerObject
    };
//alert(JSON.stringify(formData))
    axios.post('http://localhost:8000/nabeeha/submitformresponse', formData)
      .then(response => {
        setIsFormSubmitted(true);
      })
      .catch(error => {
        if (error.response && error.response.status === 400 && error.response.data.error === 'Form Response Already Submitted') {
          setFormSubmissionError('You can only submit this form once. A form response has already been submitted against this email.');
          setIsFormSubmitted(true)
        } 
        else if (error.response && error.response.status === 700 && error.response.data.error === 'Something went wrong. Seems like you have not submitted your CV earlier.') {
          setFormSubmissionError('Something went wrong processing your application. Seems like you have not submitted your CV for processing earlier.');
          setIsFormSubmitted(true)
        }
        else {
          setIsError(true);
        }
      });
  };
  
  return (
    <div id="nab-form-outer-div">
      {isJobAcceptingResponses ? (
        <div id="nab-form">
          {!isFormSubmitted ? (
            <>
              <div id="nab-form-heading">Apply for {jobrole} </div>
              <hr id="nab-form-hr" />
              
              <label  for="fullName"><p class="nab-cv-form-jobdes"><b>Last Date to Submit Application: {jobDeadline}</b></p></label>
              <br></br>
              <form>
                <div id="nab-formcoll-group">
                  <label id="nab-form-label" htmlFor="email">Email<span id="nab-form-required-field">*</span>:</label>
                  <input type="email" id="nab-form-input" name="email" onChange={(e) => setUserEmail(e.target.value)} required />
                </div>
                <hr id="nab-form-hr" />
                <div id="nab-formcoll-group">
                  <label id="nab-form-label">Tell us a little about yourself.</label>
                </div>
                <div id="nab-form-all-questions">
                  {questions.map((question, index) => (
                    <div key={index} id='nab-q1'>
                      <FormQuestion
                        statement={question.question}
                        answers={question.options}
                        setUserAnswer={(value) => setUserAnswers(prevState => ({ ...prevState, [index]: value}))}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" id="nab-cv-button" onClick={handleFormSubmit}>Submit</button>
              </form>
              <div>
                {incompleteFormError && <p style={{ color: 'red' }}>{incompleteFormError}</p>}
              </div>
            </>
          ) : (
            <div id="form-success-message">
              {formSubmissionError ? (
                <>
                  <img src={erroricon} alt="Error" />
                  <p>{formSubmissionError}</p>
                </>
              ) : (
                <>
                  <img src={success} alt="Success" />
                  <p>Your application for {jobrole} has been received successfully. We will get back to you soon.</p>
                </>
              )}
            </div>
          )}
          
        </div>
      ) : (
        <div id="nab-form">
          <div id="nab-cv-heading">Apply for {jobrole} Form Expired</div>
          <hr id="nab-cv-hr" />
          <p style={{ color: 'red', fontSize: 25 }}>We're sorry. We are no longer accepting responses for {jobrole}.</p>
        </div>
      )}
    </div>
  );
      }  


