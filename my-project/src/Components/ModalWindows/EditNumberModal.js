import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Modal.css'

const EditModal = ({ isOpen, title, closeModal, saveValue, originalValue }) => {

  const [inputVal,setInputVal] = useState(originalValue);
  const [err,setErr] = useState("");
   
  const handleInput = (event) => {
    setInputVal(event.target.value);
  };

  const saveNewValue = () => {
    if (inputVal <= 0 || inputVal >=100)
      setErr("Please enter a value between 0 and 100.")
    else
    {
      setErr("");
      saveValue(inputVal)
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
        <input type="number" placeholder={title} className='kmodal-tf' value={inputVal} onChange={(event)=>handleInput(event)}></input>
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