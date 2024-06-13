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
        "Congratulations! Your application has successfully passed Phase 2 of our recruitment.\n\nFor Phase 3 and 4, we require candidates to upload their video-interviews for non-technical assessment and attempt a technical test.\n\nMake sure you have the following before starting the test:\nA working webcam.\nA stable internet connection. \n\nPlease find attached the link to the test and the password you will need for accessing the test. Please submit it within the deadline specified. Good Luck! \n\n"
      );
    const [formEmailSub, setSubject] = useState("Regarding Your Application");
    const [savedjobId, setSavedJob] = useState();  
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formEmailDeadline, setDeadline] = useState("The interview and test will be available starting: ");
    const [error, setError] = useState('');

    const [startDate,setStartDate] = useState();
    const [days,setDays] = useState();

    const [tab,setTab] = useState(1);
    const [categories,setCategories] = useState([""]);

    const [questions,setQuestions] = useState([{question: [
        {
          type: 'text',
          text: '',
        }], options: ['']}]);
    

    const handleDurationChange = (event) => {
      const selectedDuration = event.target.value;
      setTestDuration(selectedDuration);
    };

    const formatDate2 = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date); 
        const year = formattedDate.getFullYear();
        const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
        const day = `${formattedDate.getDate()}`.padStart(2, '0');
        return `${day}/${month}/${year}`;
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

          const link = `localhost:3000/applicant/videointerview/${job._id}`

           // Append the link to the end of the email body
                  const updatedEmailBody = `${formEmailBody}\n<b>${link}</b>\n\n${formEmailDeadline}<b>${formatDate2(startDate)}</b>\n\nThe link will be available for ${days} days after the start date!\n\nPlease find your password below which you will need to login:\n`;
                  //alert(updatedEmailBody)
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

          var param = {'job':job,'duration':testDuration,'questions':questions,'categories':categories,'startDate':startDate,'days':days,'emailBody':updatedEmailBody,'emailSubject':formEmailSub};
            axios.post("http://localhost:8000/komal/createtest",param).then((response) => {
            //alert(JSON.stringify(response.data));
            if (response.data.status == "error"){
                setMessage(response.data.error);
                setMessageTitle('Error');
                setOpenModal(true);}
            else {
                   
                setMessage("Technical test saved successfully!")
                setMessageTitle('Test Saved');
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
            setSubject("Regarding your Application for "+props.job.jobTitle+" at "+props.job.companyname)

    }
      }, [props.job]);

      const handleQuestionTextChange = (index,qIndex,ev) =>{
          var text = ev.target.value;
          var copy = [...questions];
          copy[index].question[qIndex].text = text;
          setQuestions(copy);
      }

      const handleCategoryTextChange = (ev,index) =>{
          var text = ev.target.value;
          var copy = [...categories];
          copy[index] = text;
          setCategories(copy);
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

    const setCategory = (index, event) => {
        var copy = [...questions];
        copy[index].category = event.target.value
        setQuestions(copy);
    };
    

    const handleOptionTextChange = (qIndex,optIndex, ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[qIndex].options[optIndex] = text;
        setQuestions(copy);
    }

    const deleteOption=(qIndex,optIndex)=>{
        var copy = [...questions];

        if (copy[qIndex].answer == copy[qIndex].options[optIndex])
            copy[qIndex].answer = "";

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

    const deleteCategory=(index)=>{

        for (var i = 0; i < questions.length; i++){
            if (questions[i].category == categories[index]){
                setMessage("Please delete questions in this category before deleting the category!")
                setMessageTitle('Error');
                setOpenModal(true);
                return;
            }
        }

        var copy = [...categories];
        copy.splice(index, 1);
        setCategories(copy);
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

    const addCategory=()=>{
        

        if (categories.length >= 10){
            setMessage("Cannot add more than 10 categories!")
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        var copy = [...categories];
        copy.push("");
        setCategories(copy);
    }

    const formatDate = (date) => {
        if (!date) return '';
    
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = `${(formattedDate.getMonth() + 1)}`.padStart(2, '0');
        const day = `${formattedDate.getDate()}`.padStart(2, '0');
        let hours = formattedDate.getHours();
        const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour clock format
    
        return `${day}/${month}/${year} ${hours}:${minutes} ${amOrPm}`;
    };
    
    

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setStartDate(selectedDate);
    };

    const handleDaysChange = (event) => {
        const selectedDays = event.target.value;
        setDays(selectedDays);
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
          axios.post('http://localhost:8000/komal/uploadquestionpic',fdata)
          .then(res => {
            if (res.data.msg.status == 'success'){
                addImage(index,res.data.msg.NewPath);
                t.target.value = '';
            }
            else{
                setMessage("Error uploading image!")
                setMessageTitle('Error');
                setOpenModal(true);
            }
           
        })
          .catch(
            err=>{
                setMessage("Something went wrong, please try again..");
                setMessageTitle('Error');
                setOpenModal(true);
            });
        }

        
         
    }

    const saveTest=()=>{

        if (!startDate || !days)
        {
            setMessage('Please fill all fields!');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(startDate);

        if (selectedDate < currentDate) {
            setMessage('Start date cannot be in the past!');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        const deadlineDate = new Date(job.P2FormDeadline);

        if (selectedDate <= deadlineDate) {
            setMessage('Start date must be after Form Deadline:'+formatDate(job.P2FormDeadline));
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        if (days < 1 || days > 15){
            setMessage('Please enter valid days (1-15)!');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        setModalIsOpen(true);
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

            if (copy[i].points < 1 || copy[i].points > 10){
                flag = false;
                setMessage("Please enter valid points (1-10) for each question!")
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

            if (!copy[i].category || copy[i].category.trim()=='')
            {
                flag = false;
                setMessage("Please select a category for all questions!")
                setMessageTitle('Error');
                setOpenModal(true);
                break;
            }
        }

        if (flag)
            setTab(3);

        
    }

    const gotoQuestions=()=>{

        if (categories.length == 0){
            setMessage("Please add at least one category!")
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        for (var i = 0; i < categories.length; i++) {
            if (categories[i].trim() === "") {
                setMessage("Please fill all fields!");
                setMessageTitle('Error');
                setOpenModal(true);
                return;
            }
        }

        setTab(2);
        // alert(JSON.stringify(questions))
        // alert(JSON.stringify(categories) )
    }

    const gotoCategories=()=>{
        setTab(1)
        //alert(JSON.stringify(questions))
    }

    if (tab === 1) {
        return (
            <div className='kcreateform-container'>
                <div className='kcreateformpage-btns'>
                    <label className='kcreateformpage-formdeadline ktest-catlbl'>Create Categories for Questions:</label>
                    <button className='kcreateformpage-cancelbtn ktest-backbtn' onClick={()=>navigate(-1,{state:{'jobID':job._id}})}>Back</button>
                    <button className='kcreateformpage-savebtn' onClick={gotoQuestions}>Next</button>
                </div>
                <div className='kcreateform-questions'>
                    {categories.map((form, iindex) => (
                        <div key={form.id}>
                            <div className='kformquestion-con' tabindex="0">
                                <div className='kformquestion-header'>
                                    <label className='kformquestion-header-label'><b>Category</b><span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    <textarea className='kformquestion-textbox' value={form} onChange={(event)=>handleCategoryTextChange(event,iindex)}></textarea>
                                </div>
                                <button className='kformquestion-question-delete ktest-delcat' onClick={()=>deleteCategory(iindex)}>Delete Category</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='kcreateformpage-addq-con'>
                    <button className='ktestpage-addcat' onClick={addCategory}>
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
            </div>
        );
    } else if (tab === 2) {
    return (<div className='kcreateform-container'>
    <div className='kcreateformpage-btns'>
      <label className='kcreateformpage-formdeadline'>Test Duration<span style={{ color: '#e30211', fontWeight: 'bold' }}>*</span></label>
      <input type="number" className='kcreateformpage-formdeadline-input ktest-number-input' placeholder="Duration in Minutes" min="20" max="480" value={testDuration} onChange={handleDurationChange}></input>
      <button className='kcreateformpage-cancelbtn ktestq-backbtn' onClick={gotoCategories}>Back</button>
      <button className='kcreateformpage-savebtn' onClick={saveForm}>Next</button>
    </div>
        <div className='kcreateform-questions'>
          {questions.map((form, iindex) => (
                <div key={form.id}>
                <div className='kformquestion-con' tabindex="0">
                <div className='ktestquestion-header'>
                <div className='ktestquestion-q'><div className='ktest-question-hdr'>
                    <label className='ktestquestion-header-label'><b>Question</b><span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                    <select className='kformquestion-dropdown' onChange={(event)=>setCategory(iindex,event)} value={form.category ? form.category : ""}>
                        <option value="" disabled>Category for question:</option>
                        {categories.map((option, cindex) => (
                            <option value={option} label={option}>
                            {option}
                            </option>
                        ))}
                        </select>
                        </div>
        <hr></hr>
                    {form.question.map((questionItem, qIndex) => (
                        <div key={qIndex}>
                            {questionItem.type === 'text' && (
                                <div className='ktest-fragment'>
                                    <textarea className='ktestquestion-textbox' value={questionItem.text} onChange={(event)=>handleQuestionTextChange(iindex,qIndex, event)}></textarea>
                                    <button className='ktest-crossbtn ktext-crossbtn-text' onClick={()=>removeBlock(iindex,qIndex)}>X</button>
                                </div>
                            )}
                            {questionItem.type === 'code' && (
                                <div className='ktest-fragment'>
                                <textarea className='ktest-code' onChange={(event)=>handleQuestionCodeChange(iindex,qIndex, event)} value ={questionItem.code}></textarea>
                                <button className='ktest-crossbtn ktext-crossbtn-code' onClick={()=>removeBlock(iindex,qIndex)}>X</button>
                                </div>
                            )}
                            {questionItem.type === 'image' && (
                                <div className='ktest-fragment'>
                                    <img className='ktest-img' src={`http://localhost:8000/routes/questionimages/` + questionItem.imageUrl} alt="Image" />
                                    <button className='ktest-crossbtn ktext-crossbtn-img' onClick={()=>removeBlock(iindex,qIndex)}>X</button>
                                </div>
                            )}
                        </div>))}
                    <div className='ktestquestion-q-buttons'>
                        <button className='ktest-addbtn' onClick={()=>addCodeBlock(iindex)}>Add Code Block</button>
                        <label for={`ktest-fileInput-${iindex}`} class="ktest-custom-file-upload ktest-addbtn">
                            Add Image
                        </label>
                        <input type="file" id={`ktest-fileInput-${iindex}`} className="ktest-fileInput" accept='image/*' onChange={(event)=>upload(iindex,event)}/>
                        <button className='ktest-addbtn' onClick={()=>addTextBlock(iindex)}>Add Text Block</button>
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
                    <div className='ktest-question-footer-input'>
                        <select className='kformquestion-dropdown' onChange={(event)=>setAnswer(iindex,event)} value={form.answer ? form.answer : ""}>
                        <option value="" disabled>Select the correct option:</option>
                        {form.options.map((option, jindex) => (
                            <option value={option} label={option}>
                            {option}
                            </option>
                        ))}
                        </select>
                        <div className='ktest-points-div'>
                            <label className='ktest-points-lbl'>Points: </label>
                            <input className='ktest-number-input ktest-points' type="number" min="1" max="10" placeholder='Points' onChange={(event)=>handlePointsChange(iindex,event)} value={form.points}></input>
                        </div>
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
      </div>
    )
    } else if (tab === 3) {
        return <div>
            <div className='kcreateform-container'>
                <div className='ktest-final-con' tabindex="0">
                <div className='ktest-final-con-hdr'>
                    <label className='ktest-final-lbl'>Finalize and Save Test</label>
                    <div className='ktest-final-btns'>
                        <button className='kcreateformpage-cancelbtn ktestfinal-cancel' onClick={()=>setTab(2)}>Back</button>
                        <button className='kcreateformpage-savebtn' onClick={saveTest}>Save</button>
                    </div>
                </div>
                <hr className='ktestfinal-hr'></hr>
                <div className='ktestfinal-innercon'>
                    <div className='ktestfinal-fields'>
                        <label className='ktestfinal-fields-lbl'>Start Date:<span style={{color: '#e30211', fontWeight: 'bold'}}>*</span></label>
                        <input className="ktestfinal-fields-input" type="datetime-local" value={startDate} onChange={(event)=>handleDateChange(event)}></input>
                    </div>
                    <div className='ktestfinal-fields ktestfinal-fields-last'>
                        <label className='ktestfinal-fields-lbl'>Number of days for which link will be open:<span style={{color: '#e30211', fontWeight: 'bold'}}>*</span></label>
                        <input className="ktestfinal-fields-input" type="number" value={days} min="1" max="15" onChange={(event)=>handleDaysChange(event)}></input>
                    </div>
                </div>
                <hr className='ktestfinal-hr'></hr>
                <label className='ktestfinal-note'>Note: &nbsp;&nbsp; This will be the starting date and accessible days for both video interview and technical test. The applicants will be able to access the link on these days only.</label>
                </div>
                
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
        <p>This will be the default email sent to the shortlisted applicant. The link and date for attempting the video interview and technical test along with the candidate's password will be automatically attached.</p>
        <label><b>Job Title:</b> {job?.jobTitle}</label>
        <div className='krejemail-email'>
          <label><b>Email Subject:</b></label>
          <label>{formEmailSub}</label>
         
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
        </div>; 
    }
  }