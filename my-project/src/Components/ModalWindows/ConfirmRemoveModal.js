import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Modal.css'

const RemoveModal = ({ isOpen, title,value, closeModal, removeValue }) => {

    const [val,setVal] = useState(value);
    const [_title,setTitle] = useState(title);

    useEffect(() => {
        setVal(value)
      }, [value]);

      useEffect(() => {
          setVal(title)
        }, [title]);

  return (
    <Modal
      className='Modal'
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Message Modal"
    >
    <div className='ModalContent'>
        <div className='kmodal-title-div'>
            {title && <label className='kmodal-title'>Remove Confirmation</label>}
        </div>
        <label className='kmodal-msg'>{"Are you sure you want to remove the recruiter @"+title+" ?"}</label>
        <hr className='kmodal-hr'></hr>
        <div className='kmodal-btns'>
            <button  className='kmodal-closebtn' onClick={closeModal}>No</button>
            <button  className='kmodal-closebtn' onClick={()=>removeValue(value)}>Yes</button>
        </div>
    </div>
    </Modal>
  );
};

export default RemoveModal;