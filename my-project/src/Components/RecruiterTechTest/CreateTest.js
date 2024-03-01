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
    const [testDuration, setTestDuration] = useState('');
    const [formLink, setFormLink] = useState('');
    const [formEmailBody, setEmail] = useState(
        "Congatulations! Your application has successfully passed Phase 2 of our recruitment.\n\nFor Phase 3 and 4, we require candidates to upload their video-interviews for non-technical assessment and attempt a technical test. \n\nPlease find attached the link to the test and the password you will need for accessing the test. Please submit it within the deadline specified. Good Luck! \n\n"
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
        }], options: ['']}]);
    

    const handleDurationChange = (event) => {
      const selectedDuration = event.target.value;
      setTestDuration(selectedDuration);
    };
    

    const handlePointsChange = (index,event) => {
      const selectedPoints = event.target.value;
      var copy = [...questions];
      copy[index].points = selectedPoints;
      setQuestions(copy);
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

          var param = {'job':job,'duration':testDuration,'questions':questions};
            axios.post("http://localhost:8000/nisa/createtest",param).then((response) => {
            //alert(JSON.stringify(response.data));
            if (response.data.status == "error"){
                setMessage(response.data.error);
                setMessageTitle('Error');
                setOpenModal(true);}
            else {
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
                navigate('/recruiter/job', { state: { jobID: job._id} });
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

    const handleSetForm = () => {
        
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

    const addImage=(index,file)=>{
        var copy = [...questions];
        //alert(file)
        copy[index].question.push({type: 'image', imageUrl: file,});
        setQuestions(copy);
    }

    const removeBlock=(index,qIndex)=>{
        //alert(index)
        var copy = [...questions];
        copy[index].question.splice(qIndex, 1);
        setQuestions(copy);
    }

    const upload = (index,t) =>{
        t.preventDefault();
        
         //alert(index)

        const img = t.target.files[0];
  
        if (img)
        {
          var fdata = new FormData();
          fdata.append("Image", img);
          axios.post('http://localhost:8000/nisa/uploadquestionpic',fdata)
          .then(res => {
            if (res.data.msg.status == 'success'){
                addImage(index,res.data.msg.NewPath);
            }
            else{
                alert("ERROR UPLOADING")
            }
           
        })
          .catch(
            err=>{
                 alert("ERROR IN UPLOADAXIOS : "+err)
            });
        }

        
         
    }

    const saveForm=()=>{
        var flag = true;
        var copy = [...questions];

        if (!testDuration || testDuration.trim() == "")
        {
            setMessage('Please add test duration!');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        if (testDuration < 20 || testDuration > 480){
            setMessage('Test duration should be at least 20 minutes and no more than 8 hours!');
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
            if (!copy[i].question || copy[i].question.length == 0)
            {
                flag = false;
                setMessage("Please fill all fields!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }

            if (!copy[i].points || copy[i].points.trim() == ''){
                flag = false;
                setMessage("Please enter points for each question!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }

            if (copy[i].points < 1){
                flag = false;
                setMessage("Please enter valid points for each question!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }

            for (var j = 0; j < copy[i].question.length; j++){
                //alert(JSON.stringify(copy[i].question[j]))
                if (copy[i].question[j].type == "text" && copy[i].question[j].text.trim() == ''){
                    flag = false;
                    setMessage("Please fill all text blocks or remove them!")
                    setMessageTitle('Error');
                    setOpenModal(true);
                    break;
                }
                else if (copy[i].question[j].type == "code" && copy[i].question[j].code.trim() == ''){
                    flag = false;
                    setMessage("Please fill all code blocks or remove them!")
                    setMessageTitle('Error');
                    setOpenModal(true);
                    break;
                }
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
      <input type="number" className='kcreateformpage-formdeadline-input' placeholder="Duration in Minutes" min="20" max="480" value={testDuration} onChange={handleDurationChange}></input>
      <button className='kcreateformpage-cancelbtn' onClick={()=>navigate(-1,{state:{'jobID':job._id}})}>Discard Test</button>
      <button className='kcreateformpage-savebtn' onClick={saveForm}>Save Test</button>
    </div>
        <div className='kcreateform-questions'>
          {questions.map((form, iindex) => (
                <div key={form.id}>
                <div className='kformquestion-con' tabindex="0">
                <div className='ktestquestion-header'>
                <div className='ktestquestion-q'>
                    <label className='kformquestion-header-label'><b>Question</b><span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                    {form.question.map((questionItem, qIndex) => (
                        <div key={qIndex}>
                            {questionItem.type === 'text' && (
                                <React.Fragment className='ktest-fragment'>
                                    <textarea className='ktestquestion-textbox' value={questionItem.text} onChange={(event)=>handleQuestionTextChange(iindex,qIndex, event)}></textarea>
                                    <button onClick={()=>removeBlock(iindex,qIndex)}>X</button>
                                </React.Fragment>
                            )}
                            {questionItem.type === 'code' && (
                                <React.Fragment className='ktest-fragment-code'>
                                <textarea className='ktest-code' onChange={(event)=>handleQuestionCodeChange(iindex,qIndex, event)} value ={questionItem.code}></textarea>
                                <button className='ktest-codebtn' onClick={()=>removeBlock(iindex,qIndex)}>X</button>
                                </React.Fragment>
                            )}
                            {questionItem.type === 'image' && (
                                <React.Fragment className='ktest-fragment'>
                                    <img className='ktest-img' src={`http://localhost:8000/routes/questionimages/` + questionItem.imageUrl} alt="Image" />
                                    <button onClick={()=>removeBlock(iindex,qIndex)}>X</button>
                                </React.Fragment>
                            )}
                        </div>))}
                    <div className='ktestquestion-q-buttons'>
                        <button onClick={()=>addCodeBlock(iindex)}>Add Code Block</button>
                        <label for={`ktest-fileInput-${iindex}`} class="ktest-custom-file-upload">
                            Add Image
                        </label>
                        <input type="file" id={`ktest-fileInput-${iindex}`} className="ktest-fileInput" accept='image/*' onChange={(event)=>upload(iindex,event)}/>
                        <button onClick={()=>addTextBlock(iindex)}>Add Text Block</button>
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
                    onChange={(event)=>handleOptionTextChange(iindex, oIndex, event)}>
                    </input></div>
                    <button
                    className='kformquestion-option-delete'
                    onClick={()=>deleteOption(iindex,oIndex)}>
                    X
                    </button>
                </div>
                ))}
                    <button className='kformquestion-addbtn' onClick={(event)=>addOption(iindex,event)}>Add Option</button>
                </div>
                <hr></hr>
                <div className='kformquestion-footer'>
                <select className='kformquestion-dropdown' onChange={(event)=>setAnswer(iindex,event)}>
                <option value="" disabled selected>Select the correct option:</option>
                {form.options.map((option, index) => (
                    <option value={index} label={option}>
                    {option}
                    </option>
                ))}
                </select>
                <div>
                    <label>Points: </label>
                    <input type="number" min="1" placeholder='Points for correct option' onChange={(event)=>handlePointsChange(iindex,event)} value={form.points}></input>
                </div>
                <button className='kformquestion-question-delete' onClick={()=>deleteQuestion(iindex)}>Delete Question</button>
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
        
        <h2>Set Interview and Test Link Email</h2>
        <p>This will be the default email sent to the shortlisted applicant. The link for attempting the video interview and technical test along with the candidate's password will automatically attached.</p>
        <label><b>Job Title:</b> {job?.jobTitle}</label>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>Regarding Your Application for {job?.jobTitle}</label>
         
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