import React, { useEffect, useState } from 'react' 
import './CreateFormPage.css';


export default function CreateForm(props) {

    const [questions, setQuestions] = useState([{ question: '', options: [''] }]);

    const handleQuestionTextChange = (index,ev) =>{
        var text = ev.target.value;
        var copy = [...questions];
        copy[index].question = text;
        setQuestions(copy);
    }

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

        if (copy.length < 1)
        {
            flag = false;
            alert("Please enter at least 1 question!")
        }

        for (var i = 0; i < copy.length; i++){
            if (!copy[i].question || copy[i].question.trim()=='')
            {
                flag = false;
                alert("Please fill all fields!")
                break;
            }

            if (copy[i].options.length < 2)
            {
                flag = false;
                alert("Please enter at least 2 options for each question!")
                break;
            }

            for (var j = 0;j < copy[i].options.length; j++){
                if (copy[i].options[j].trim()=='')
                {
                    flag = false;
                    alert("Please fill all fields!")
                    break;
                }
            }

            if (!flag)
                break;

            if (!copy[i].answer || copy[i].answer.trim()=='')
            {
                flag = false;
                alert("Please select acceptable option for all questions!")
                break;
            }
        }

        if (flag)
            alert("Form saved!")

        //save
    }

    return (<div className='kcreateform-container'>
    <div className='kcreateformpage-btns'>
      <button className='kcreateformpage-cancelbtn'>Discard Form</button>
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
      </div>
    )
  }