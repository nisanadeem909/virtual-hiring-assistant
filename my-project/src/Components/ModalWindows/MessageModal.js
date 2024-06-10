import React from 'react';
import Modal from 'react-modal';
import './Modal.css'

const MessageModal = ({ isOpen, message, title, closeModal }) => {
  return (
    <Modal
      className='Modal'
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Message Modal"
    >
    <div className='ModalContent'>
        <div className='kmodal-title-div'>
            {title && <label className='kmodal-title'>{title}</label>}
        </div>
        {message && <label className='kmodal-msg'>{message}</label>}
        <hr className='kmodal-hr'></hr>
      <button  className='kmodal-closebtn' onClick={closeModal}>Close</button>
    </div>
    </Modal>
  );
};

export default MessageModal;