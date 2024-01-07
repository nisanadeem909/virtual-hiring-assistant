import React, { useEffect, useState } from 'react' 
import './CreateFormPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../ModalWindows/MessageModal';


export default function CreateForm(props) {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
    const [job,setJob] = useState({'jobTitle':'Loading..','CVFormLink':'Loading..','AccCVScore': { $numberDecimal: '0' },'CVDeadline':'dd/mm/yyyy','status':'0','jobDescription':'Loading..'})
    const [formDeadline, setFormDeadline] = useState('');

    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);

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

    const handleSetForm = () => {
        
        navigate('phase2email', { state: { job } });
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

        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'yyyy-mm-dd' format
        const selectedDeadline = new Date(formDeadline).toISOString().split('T')[0]; // Convert formDeadline to 'yyyy-mm-dd' format

        if (selectedDeadline <= currentDate) {
            setMessage('Form deadline should be after the current date.');
            setMessageTitle('Error');
            setOpenModal(true);
            return;
        }

        if (selectedDeadline <= job.CVDeadline) {
            setMessage('Form deadline should be after the job CV deadline.');
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
            var param = {'job':job,'formdeadline':formDeadline,'questions':questions};
            axios.post("http://localhost:8000/komal/createform",param).then((response) => {
            // alert(JSON.stringify(response.data));
            if (response.data.status == "success"){
                setMessage("Form has been saved and link for applicants is: "+response.data.formLink)
                setMessageTitle('Form Saved');
                setOpenModal(true);
                handleSetForm()
                }
                else {
                setMessage(response.data.error);
                setMessageTitle('Error');
                setOpenModal(true);}
            })
            .catch(function (error) {
                alert("Axios Error:" + error);
            });
            
        }
    }

    return (<div className='kcreateform-container'>
    <div className='kcreateformpage-btns'>
      <label className='kcreateformpage-formdeadline'>Form Deadline: </label>
      <input type="date" className='kcreateformpage-formdeadline-input' value={formDeadline} onChange={handleDeadlineChange}></input>
      <button className='kcreateformpage-cancelbtn' onClick={()=>navigate(-1,{state:{'jobID':job._id}})}>Discard Form</button>
      <button className='kcreateformpage-savebtn' onClick={saveForm}>Save Form</button>
    </div>
        <div className='kcreateform-questions'>
          {questions.map((form, index) => (
                <div key={form.id}>
                <div className='kformquestion-con' tabindex="0">
                <div className='kformquestion-header'>
                <label className='kformquestion-header-label'><b>Question:</b></label>
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
      </div>
    )
  }