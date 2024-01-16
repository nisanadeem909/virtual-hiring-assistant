import React, { useEffect, useState } from 'react' 
import './VideoInterviewQuestion.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';
import loading from '../images/loading3.gif';

export default function CreateForm(props) {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([{ question: ''}]);
    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [formDeadline, setFormDeadline] = useState('');
    const [formLink, setFormLink] = useState('');

    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);


    const [showNextPage, setNextPage] = useState(false);
    const handleDeadlineChange = (event) => {
      const selectedDate = event.target.value;
      setFormDeadline(selectedDate);
    };

    useEffect(() => {
        if (props.job){
            setJob(props.job);

        //alert(JSON.stringify(job))
    }
      }, [props.job]);

    const handleQuestionTextChange = (index,ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[index].question = text;
        setQuestions(copy);
    }

    const handleSetForm = (formlink) => {
        
        navigate('phase2email', { state: { job: job,formLink:formlink,deadline:formDeadline } });
      };

    
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
        if (copy.length < 3 || copy.length > 5){
            flag = false;
            setMessage("For a 5-minute interview, it is recommended to set between 3 to 5 questions only.")
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


            
            // if (!flag)
            //     break;

           
        }

        if (flag)
        {
            // var param = {'job':job,'formdeadline':formDeadline,'questions':questions};
            // axios.post("http://localhost:8000/komal/createform",param).then((response) => {
            // // alert(JSON.stringify(response.data));
            // if (response.data.status == "success"){
            //     setFormLink(response.data.formLink)
            //     setMessage("Form has been saved and link for applicants is: "+response.data.formLink)
            //     setMessageTitle('Form Saved');
            //     setOpenModal(true);
            //     handleSetForm(response.data.formLink)
            //     }
            //     else {
            //     setMessage(response.data.error);
            //     setMessageTitle('Error');
            //     setOpenModal(true);}
            // })
            // .catch(function (error) {
            //     setMessage("Something went wrong, please try again..");
            //     setMessageTitle('Error');
            //     setOpenModal(true);
            //     console.error("Axios Error:" + error);
            // });
            
        }

        setNextPage(true);
        console.log(showNextPage)
    }

    return (
        <div className='kcreateform-container'>
          {!showNextPage && (
            <div className='nab-createformpage-btns'>
              <label className='nab-createformpage-formdeadline'>Phase 3 Deadline<span style={{ color: '#e30211', fontWeight: 'bold' }}>*</span></label>
              <input type="datetime-local" className='kcreateformpage-formdeadline-input' value={formDeadline} onChange={handleDeadlineChange}></input>
              <div id="nab-vid-interview-btns">
                <button className='nab-createformpage-cancelbtn' onClick={() => navigate(-1, { state: { 'jobID': job._id } })}>Discard</button>
                <button className='kcreateformpage-savebtn' onClick={saveForm}>Next</button>
              </div>
            </div>
          )}
    
          {showNextPage && (
            
            /* This part does not do anything yet */
            <div className='nab-set-acceptability-criteria'>

            <button className='nab-createformpage-savebtn' onClick={saveForm}>Save</button>
              {/* Content to show when Next is clicked */}
              <img src={loading} className='kjobdashboardpage-loading-img'></img>
              {/*nothing*/}

              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </div>
          )}
    
          {!showNextPage && (
            <div className='kcreateform-questions'>
              {questions.map((form, index) => (
                <div key={form.id}>
                  <div className='kformquestion-con' tabIndex="0">
                    <div className='kformquestion-header'>
                      <label className='kformquestion-header-label'>
                        <b>Question</b>
                        <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                      </label>
                      <textarea
                        className='kformquestion-textbox'
                        value={form.question}
                        onChange={(event) => handleQuestionTextChange(index, event)}
                      ></textarea>
                    </div>
    
                    <div className='kformquestion-footer'>
                      <br></br>
                      <button className='nabformquestion-question-delete' onClick={() => deleteQuestion(index)}>Delete Question</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    
          {!showNextPage && (
            <div className='kcreateformpage-addq-con'>
              <button className='kcreateformpage-addq' onClick={(event) => addQuestion(event)}>
                +
              </button>
            </div>
          )}
    
          {!showNextPage && (
            <MessageModal
              isOpen={openModal}
              message={message}
              title={messageTitle}
              closeModal={() => {
                setOpenModal(false);
                if (messageTitle === 'Form Saved') {
                  navigate(-1, { state: { 'jobID': job._id } });
                }
              }}
            />
          )}
        </div>
      );
    }