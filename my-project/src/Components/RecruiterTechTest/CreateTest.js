import React, { useEffect, useState } from 'react' 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import ReactModal from 'react-modal';
import './CreateTest.css'
import img1 from '../finalhome.png'



export default function CreateTest(props) {

    const navigate = useNavigate();

    //const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [testDuration, setFormDeadline] = useState('');
    const [formLink, setFormLink] = useState('');
    const [formEmailBody, setEmail] = useState(
        "Congatulations! Your application for role at Manafa Technologies has successfully passed Phase 1 of our recruitment.\n\nFor Phase 2, we require candidates to answer a few important questions about their role at our company. \n\nPlease find attached the link to the Form. Please submit it within the deadline specified. Good Luck! \n\n"
      );
    const [formEmailSub, setSubject] = useState("Regarding Your Application");
    const [savedjobId, setSavedJob] = useState();  
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formEmailDeadline, setDeadline] = useState("Form submission deadline date: ");
    const [error, setError] = useState('');

    const [questions,setQuestions] = useState([{question: [
        {
          type: 'text',
          text: '',
        },{type: 'code',
        code: 'console.log("Hello, World!");',},{type: 'image',
        imageUrl: img1,}], options: ['']}]);
    

    const handleDeadlineChange = (event) => {
      const selectedDate = event.target.value;
      setFormDeadline(selectedDate);
    };

    const handleDefaultEmailChange = (event) => {
        setEmail(event.target.value);
      };

      const handleSave = async () => {


        
        if (!formEmailBody.trim()) {
            setError('Email body cannot be empty. Please provide a valid email body.');
            return;
          }
      
          setError('');
          setModalIsOpen(false)

        //   var param = {'job':job,'formdeadline':formDeadline,'questions':questions};
        //     axios.post("http://localhost:8000/komal/createform",param).then((response) => {
        //     // alert(JSON.stringify(response.data));
        //     if (response.data.status == "success"){
        //         setFormLink(response.data.formLink)
        //         setMessage("Form has been saved and link for applicants is: "+response.data.formLink)
        //         setMessageTitle('Form Saved');
        //         setOpenModal(true);
        //         handleSetForm(response.data.formLink)
        //         }
        //         else {
        //         setMessage(response.data.error);
        //         setMessageTitle('Error');
        //         setOpenModal(true);}
        //     })
        //     .catch(function (error) {
        //         setMessage("Something went wrong, please try again..");
        //         setMessageTitle('Error');
        //         setOpenModal(true);
        //         console.error("Axios Error:" + error);
        //     });
      
         
          // Append the link to the end of the email body
        //   const updatedEmailBody = `${formEmailBody}\n\n${formLink}\n\n${formEmailDeadline}${formDeadline}`;
        //   //alert(updatedEmailBody)
        //   try {
        //     const response = await axios.post(`http://localhost:8000/nisa/api/emailForm/${job._id}`, {
        //       formEmailSub,
        //       formEmailBody: updatedEmailBody,
        //     });
        
        //     console.log('Updated:', response.data);
           
        //     setSavedJob(job._id);
        //   } catch (error) {
        //     console.error('Error updating emails and form:', error);


        //   }
      };

    useEffect(() => {
        if (props.job){
            setJob(props.job);

    }
      }, [props.job]);

    const handleQuestionTextChange = (index,qIndex,ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[index].question[qIndex].text = text;
        setQuestions(copy);
    }

    const handleQuestionCodeChange = (index,qIndex,ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[index].question[qIndex].code = text;
        setQuestions(copy);
    }

    const handleSetForm = (formlink) => {
        
        navigate('/recruiter/job', { state: { jobID: job._id} });
      };

    const setAnswer = (index, event) =>{
        var copy = [...questions];
        copy[index].answer = event.target.value;
        setQuestions(copy);
    }

    const handleOptionTextChange = (qIndex,optIndex, ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[qIndex].options[optIndex] = text;
        setQuestions(copy);
    }

    const deleteOption=(qIndex,optIndex)=>{
        var copy = [...questions];
        copy[qIndex].options.splice(optIndex, 1);
        setQuestions(copy);
    }

    const addOption=(qIndex,ev)=>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[qIndex].options.push(text);
        setQuestions(copy);
    }

    const deleteQuestion=(index)=>{
        var copy = [...questions];
        copy.splice(index, 1);
        setQuestions(copy);
    }

    const addQuestion=(ev)=>{
        var text = ev.target.value;
        var copy = [...questions];
        copy.push({question: [
            {
              type: 'text',
              text: '',
            }], options: ['']});
        setQuestions(copy);
    }

    const formatDate = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date); 
        const year = formattedDate.getFullYear();
        const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
        const day = `${formattedDate.getDate()}`.padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    const addCodeBlock=(index)=>{
        var copy = [...questions];
        copy[index].question.push({type: 'code', code: '',});
        setQuestions(copy);
    }

    const addTextBlock=(index)=>{
        var copy = [...questions];
        copy[index].question.push({type: 'text', text: '',});
        setQuestions(copy);
    }

    const removeBlock=(index,qIndex)=>{
        var copy = [...questions];
        copy[index].question.splice(qIndex, 1);
        setQuestions(copy);
    }

    const saveForm=()=>{
        var flag = true;
        var copy = [...questions];

        if (!testDuration || testDuration.trim() == "")
        {
            setMessage('Please fill all fields!');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        // const currentDate = new Date().toISOString(); 
        // const selectedDeadline = new Date(formDeadline).toISOString();
        // if (selectedDeadline <= currentDate) {
        //     setMessage('Form deadline should be after the current date.');
        //     setMessageTitle('Error');
        //     setOpenModal(true);
        //     return;
        // }

        // if (selectedDeadline <= job.CVDeadline) {
        //     setMessage('Form deadline should be after the job CV deadline: '+formatDate(job.CVDeadline));
        //     setMessageTitle('Error');
        //     setOpenModal(true);
        //     return;
        // }

        if (copy.length < 1)
        {
            flag = false;
            setMessage("Please enter at least 1 question!")
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        for (var i = 0; i < copy.length; i++){
            if (!copy[i].question || copy[i].question.trim()=='')
            {
                flag = false;
                setMessage("Please fill all fields!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }

            if (copy[i].options.length < 2)
            {
                flag = false;
                setMessage("Please enter at least 2 options for each question!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }

            for (var j = 0;j < copy[i].options.length; j++){
                if (copy[i].options[j].trim()=='')
                {
                    flag = false;
                    setMessage("Please fill all fields!")
                    setMessageTitle('Error');
                    setOpenModal(true);
                    break;
                }
            }

            if (!flag)
                break;

            if (!copy[i].answer || copy[i].answer.trim()=='')
            {
                flag = false;
                setMessage("Please select acceptable option for all questions!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }
        }

        if (flag)
        {
           
            setModalIsOpen(true);

            
            
        }
    }

    return (<div className='kcreateform-container'>
    <div className='kcreateformpage-btns'>
      <label className='kcreateformpage-formdeadline'>Test Duration<span style={{ color: '#e30211', fontWeight: 'bold' }}>*</span></label>
      <input type="number" className='kcreateformpage-formdeadline-input' placeholder="Duration in Minutes" min="20" value={testDuration} onChange={handleDeadlineChange}></input>
      <button className='kcreateformpage-cancelbtn' onClick={()=>navigate(-1,{state:{'jobID':job._id}})}>Discard Test</button>
      <button className='kcreateformpage-savebtn' onClick={saveForm}>Save Test</button>
    </div>
        <div className='kcreateform-questions'>
          {questions.map((form, index) => (
                <div key={form.id}>
                <div className='kformquestion-con' tabindex="0">
                <div className='ktestquestion-header'>
                <div className='ktestquestion-q'>
                    <label className='kformquestion-header-label'><b>Question</b><span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                    {form.question.map((questionItem, qIndex) => (
                        <div key={qIndex}>
                            {questionItem.type === 'text' && (
                                <React.Fragment className='ktest-fragment'>
                                    <textarea className='ktestquestion-textbox' value={questionItem.text} onChange={(event)=>handleQuestionTextChange(index,qIndex, event)}></textarea>
                                    <button onClick={()=>removeBlock(index,qIndex)}>X</button>
                                </React.Fragment>
                            )}
                            {questionItem.type === 'code' && (
                                <React.Fragment className='ktest-fragment-code'>
                                    <pre contentEditable={true} className='ktest-code' onChange={(event)=>handleQuestionCodeChange(index,qIndex, event)}>{questionItem.code}</pre>
                                    <button className='ktest-codebtn' onClick={()=>removeBlock(index,qIndex)}>X</button>
                                </React.Fragment>
                            )}
                            {questionItem.type === 'image' && (
                                <React.Fragment className='ktest-fragment'>
                                    <img className='ktest-img' src={questionItem.imageUrl} alt="Image" />
                                    <button onClick={()=>removeBlock(index,qIndex)}>X</button>
                                </React.Fragment>
                            )}
                        </div>))}
                    <div className='ktestquestion-q-buttons'>
                        <button onClick={()=>addCodeBlock(index)}>Add Code Block</button>
                        <label for="ktest-fileInput" class="ktest-custom-file-upload">
                            Add Image
                        </label>
                        <input type="file" id="ktest-fileInput" accept='image/*'/>
                        <button onClick={()=>addTextBlock(index)}>Add Text Block</button>
                    </div>
                </div>
        </div>
        <hr></hr>
        <div className='kformquestion-main'>
                {form.options.map((option, oIndex) => (
                <div key={option.id} className='kformquestion-option'>
                <div className='kformquestion-option-left'>
                    <div className='kformquestion-radio'></div>
                    <input
                    type='text'
                    className='kformquestion-option-textbox'
                    placeholder='Option'
                    value={option}
                    onChange={(event)=>handleOptionTextChange(index, oIndex, event)}>
                    </input></div>
                    <button
                    className='kformquestion-option-delete'
                    onClick={()=>deleteOption(index,oIndex)}>
                    X
                    </button>
                </div>
                ))}
                    <button className='kformquestion-addbtn' onClick={(event)=>addOption(index,event)}>Add Option</button>
                </div>
                <hr></hr>
                <div className='kformquestion-footer'>
                <select className='kformquestion-dropdown' onChange={(event)=>setAnswer(index,event)}>
                <option value="" disabled selected>Select the correct option:</option>
                {form.options.map((option, index) => (
                    <option value={index} label={option}>
                    {option}
                    </option>
                ))}
                </select>
                <div>
                    <label>Points: </label>
                    <input type="number" min="1" placeholder='Points for correct option'></input>
                </div>
                <button className='kformquestion-question-delete' onClick={()=>deleteQuestion(index)}>Delete Question</button>
                </div>
              </div>
              </div>
            ))}</div>
        <div className='kcreateformpage-addq-con'>
          <button className='kcreateformpage-addq' onClick={(event)=>addQuestion(event)}>
            +
          </button>
        </div>
        <MessageModal
        isOpen={openModal}
        message={message}
        title={messageTitle}
        closeModal={() => {
            setOpenModal(false);
            //alert(messageTitle);
            if (messageTitle === 'Test Saved') {
            navigate(-1,{state:{'jobID':job._id}});
            }
        }}
      />
      {/* Modal for showing the email textarea */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="kcreateformpage-email-modal"
        overlayClassName="kcreateformpage-email-modal-overlay"
      >
        <div className='nisa-ModalContent'>
        
        <h2>Set Test Link Email</h2>
        <p>This will be the default email sent to the shortlisted applicant. The link for the form will automatically attached.</p>
        <label><b>Job Title:</b> {job?.jobTitle}</label>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>Regarding Your Application for {job?.jobTitle} at company Manafa Technologies</label>
         
          <div>
          <label style={{
                marginTop: '2vh'
              }}>
                    {/* <b>Deadline:</b> {formatDate2(formDeadline)} */}
                  </label>

          </div>
          <textarea className='nabrejemail-textarea' value={formEmailBody} onChange={handleDefaultEmailChange}></textarea>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={()=>setModalIsOpen(false)}>Cancel</button>
        </div>
      </ReactModal>
      </div>
    )
  }