import React, { useEffect, useState } from 'react' 
import './CreateFormPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import ReactModal from 'react-modal';



export default function CreateForm(props) {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [formDeadline, setFormDeadline] = useState('');
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

    const formatDate2 = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date); 
        const year = formattedDate.getFullYear();
        const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
        const day = `${formattedDate.getDate()}`.padStart(2, '0');
        let hours = formattedDate.getHours();
        const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    
        return `${day}-${month}-${year} ${hours}:${minutes} ${amOrPm}`;
    };
    

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

          var param = {'job': job, 'formdeadline': formDeadline, 'questions': questions};
axios.post("http://localhost:8000/komal/createform", param)
    .then(async (response) => { 
        if (response.data.status === "success") { 
            setFormLink(response.data.formLink);
            const updatedEmailBody = `${formEmailBody}\n\n${response.data.formLink}\n\n${formEmailDeadline}${formatDate(formDeadline)}`;
            
            try {
                const emailResponse = await axios.post(`http://localhost:8000/nisa/api/emailForm/${job._id}`, {
                    formEmailSub,
                    formEmailBody: updatedEmailBody,
                });

                console.log('Updated:', emailResponse.data);

                setSavedJob(job._id);
            } catch (error) {
                console.error('Error updating emails and form:', error);
            }
            setMessage("Form has been saved and link for applicants is: " + response.data.formLink);
            setMessageTitle('Form Saved');
            setOpenModal(true);
            handleSetForm(response.data.formLink);
        } else {
            setMessage(response.data.error);
            setMessageTitle('Error');
            setOpenModal(true);
        }
    })
    .catch(function (error) {
        setMessage("Something went wrong, please try again..");
        setMessageTitle('Error');
        setOpenModal(true);
        console.error("Axios Error:" + error);
    });

         
         
      
    };

    useEffect(() => {
        if (props.job){
            setJob(props.job);

    }
      }, [props.job]);

    const handleQuestionTextChange = (index,ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[index].question = text;
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
        copy.push({'question': text, options: ['']});
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

    const saveForm=()=>{
        var flag = true;
        var copy = [...questions];

        if (!formDeadline || formDeadline.trim() == "")
        {
            setMessage('Please fill all fields!');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        const currentDate = new Date().toISOString(); 
        const selectedDeadline = new Date(formDeadline).toISOString();
        if (selectedDeadline <= currentDate) {
            setMessage('Form deadline should be after the current date.');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        if (selectedDeadline <= job.CVDeadline) {
            setMessage('Form deadline should be after the job CV deadline: '+formatDate(job.CVDeadline));
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

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
      <label className='kcreateformpage-formdeadline'>Form Deadline<span style={{ color: '#e30211', fontWeight: 'bold' }}>*</span></label>
      <input type="datetime-local" className='kcreateformpage-formdeadline-input' value={formDeadline} onChange={handleDeadlineChange}></input>
      <button className='kcreateformpage-cancelbtn' onClick={()=>navigate(-1,{state:{'jobID':job._id}})}>Discard Form</button>
      <button className='kcreateformpage-savebtn' onClick={saveForm}>Save Form</button>
    </div>
        <div className='kcreateform-questions'>
          {questions.map((form, index) => (
                <div key={form.id}>
                <div className='kformquestion-con' tabindex="0">
                <div className='kformquestion-header'>
                <label className='kformquestion-header-label'><b>Question</b><span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                <textarea className='kformquestion-textbox' value={form.question} onChange={(event)=>handleQuestionTextChange(index, event)}></textarea>
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
                  <option value="" disabled selected>Select the acceptable answer for screening:</option>
                  {form.options.map((option, index) => (
                      <option value={index} label={option}>
                      {option}
                      </option>
                  ))}
                  </select>
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
            if (messageTitle === 'Form Saved') {
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
        
        <h2>Set Form Link Email</h2>
        <p>This will be the default email sent to the shortlisted applicant. The link for the form will automatically attached.</p>
        <label><b>Job Title:</b> {job?.jobTitle}</label>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>Regarding Your Application for {job?.jobTitle} at company Manafa Technologies</label>
         
          <div>
          <label style={{
                marginTop: '2vh'
              }}>
                    <b>Deadline:</b> {formatDate2(formDeadline)}
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