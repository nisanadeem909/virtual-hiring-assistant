import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Modal.css'

const EditJDModal = ({ isOpen, title, closeModal, saveValue, originalValue,originalTitle }) => {

  const [inputVal,setInputVal] = useState(originalValue);
  const [inputVal2,setInputVal2] = useState(originalTitle);
  const [err,setErr] = useState("");
   
  const handleInput = (event) => {
    setInputVal(event.target.value);
  };

  const handleInput2 = (event) => {
    //alert(event.target.value)
    setInputVal2(event.target.value);
  };
  

  const saveNewValue = () => {
    if (!inputVal.trim() || !inputVal2.trim())
      setErr("Please fill all fields!")
    else
    {
      setErr("");
      saveValue(inputVal2,inputVal)
    }
  };

  const cancelSave=()=>{
    setErr("");
    setInputVal(originalValue);
    setInputVal2(originalTitle);
    closeModal();
  }

  useEffect(() => {
    if (originalValue){
        setInputVal(originalValue);
    }
  }, [originalValue]);

  useEffect(() => {
    if (originalTitle){
        setInputVal2(originalTitle);
    }
  }, [originalTitle]);

  return (
    <Modal
      className='Modal'
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Message Modal"
    >
    <div className='ModalContent'>
        <div className='kmodal-title-div'>
            {title && <label className='kmodal-title'>Edit {title}</label>}
        </div>
        <label className='kmodal-label'>Job Title<span className='kmodal-star'>*</span>:</label>
        <input type="text" placeholder='Job Title' value={inputVal2} className='kmodal-tf2' onChange={(event)=>handleInput2(event)}></input>
        <label className='kmodal-label'>Job Description<span className='kmodal-star'>*</span>:</label>
        <textarea placeholder="Job Description" className='kmodal-textarea' onChange={(event)=>handleInput(event)}>{inputVal}</textarea>
        <label className='kmodal-error'>{err}</label>
        <hr className='kmodal-hr'></hr>
        <div className='kmodal-btns'>
            <button  className='kmodal-closebtn' onClick={saveNewValue}>Save</button>
            <button  className='kmodal-closebtn' onClick={cancelSave}>Cancel</button>
        </div>
    </div>
    </Modal>
  );
};

export default EditJDModal;