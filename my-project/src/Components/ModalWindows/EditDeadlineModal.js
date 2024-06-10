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
    const currentDate = new Date().toISOString(); 
    const inputDate = new Date(inputVal).toISOString();
  
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

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date); 
    const year = formattedDate.getFullYear();
    const month = `${formattedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${formattedDate.getDate()}`.padStart(2, '0');
    const hours = `${formattedDate.getHours()}`.padStart(2, '0');
    const minutes = `${formattedDate.getMinutes()}`.padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
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
        <label className='kmodal-originaldeadline'>Current Deadline: {originalValue ? formatDate2(originalValue):''}</label>
        <input type="datetime-local" placeholder={title} className='kmodal-tf-date' value={formatDate(inputVal)} onChange={(event)=>handleInput(event)}></input>
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