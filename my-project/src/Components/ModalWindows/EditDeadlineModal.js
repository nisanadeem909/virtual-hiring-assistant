import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Modal.css'

const EditModal = ({ isOpen, title, closeModal, saveValue, originalValue }) => {

  const [inputVal,setInputVal] = useState(new Date(originalValue));
  const [err,setErr] = useState("");

  useEffect(() => {
    setInputVal(new Date(originalValue));
  }, [originalValue]);
   
  const handleInput = (event) => {
    setInputVal(event.target.value);
  };

  const saveNewValue = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const inputDate = new Date(inputVal).toISOString().split('T')[0];
  
    if (inputDate < currentDate) {
      setErr("Deadline cannot be a past date.");
    } else {
      setErr("");
      saveValue(inputVal);
    }
  };
  

  const cancelSave=()=>{
    setErr("");
    setInputVal(originalValue);
    closeModal();
  }

  useEffect(() => {
    if (originalValue){
        setInputVal(originalValue);
    }
  }, [originalValue]);

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
        <label className='kmodal-originaldeadline'>Current Deadline: {originalValue ? new Date(originalValue).toLocaleDateString('en-GB') : ''}</label>
        <input type="date" placeholder={title} className='kmodal-tf-date' value={inputVal} onChange={(event)=>handleInput(event)}></input>
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

export default EditModal;