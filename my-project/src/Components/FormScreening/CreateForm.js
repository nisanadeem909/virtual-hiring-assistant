import React, { useEffect, useState } from 'react' 
import './CreateFormPage.css';
import Select from 'react-select'

export default function CreateFormPage(props) {

   const [answer,setAnswer] = useState();
   const [optionList, setOptionList] = useState();

   const [list, setList] = useState([]);

   const addOption = () => {
     setList([...list, { id: Date.now() }]);
   };
 
   const deleteOption = (id) => {
     const updatedList = list.filter((item) => item.id !== id);
     setList(updatedList);
   };

    return (
      <div className='kformquestion-con'>
        <div className='kformquestion-header'>
            <label>Question:</label>
            <input type="text" className='kformquestion-textbox'></input>
        </div>
        <hr></hr>
        <div className='kformquestion-main'>
        {list.map((option, index) => (
          <div key={option.id} className='kformquestion-option'>
            <div className='kformquestion-radio'></div>
            <input
              type='text'
              className='kformquestion-option-textbox'
              placeholder='Option'
            ></input>
            <button
              className='kformquestion-option-delete'
              onClick={() => deleteOption(option.id)}
            >
              X
            </button>
          </div>
        ))}
            <button className='kformquestion-addbtn' onClick={addOption}>Add Option</button>
        </div>
        <hr></hr>
        <div className='kformquestion-footer'>
          <button className='kformquestion-answerbtn'>Select Acceptable Response</button>
          <button className='kformquestion-question-delete' onClick={()=>props.deleteQuestion(props.formId)}>Delete Question</button>
        </div>
      </div>
    )
  }