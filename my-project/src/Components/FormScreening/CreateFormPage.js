import React, { useState } from 'react';
import './CreateFormPage.css';
import Footer from '../Footer';
import CreateForm from './CreateForm';

export default function CreateFormPage() {
  const [jobTitle, setJob] = useState("Graphic Designer");
  const [formList, setFormList] = useState([{ id: Date.now() }]);

  const addQuestion = () => {
    const newFormList = [...formList, { id: Date.now() }];
    setFormList(newFormList);
  };

  const deleteQuestion = (idToDelete) => {
    const updatedList = formList.filter(form => form.id !== idToDelete);
    setFormList(updatedList);
  };

  return (
    <div className='kcreateformpage-con'>
      <div className='kcreateformpage-header'>
        <label className='kcreateformpage-header-title'><b>Create Form for Phase 2</b></label>
        <hr></hr>
        <label className='kcreateformpage-header-job'><b>Job: </b>{jobTitle}</label>
      </div>
      <div className='kcreateformpage-main'>
          {formList.map((form) => (
              <div key={form.id}>
                <CreateForm
                  formId={form.id}
                  deleteQuestion={deleteQuestion}
                />
              </div>
            ))}
        <div className='kcreateformpage-addq-con'>
          <button className='kcreateformpage-addq' onClick={addQuestion}>
            Add Question
          </button>
        </div>
        <div className='kcreateformpage-btns'>
          <button className='kcreateformpage-savebtn'>Save</button>
          <button className='kcreateformpage-cancelbtn'>Cancel</button>
        </div>
      </div>
      <div className='kcreateformpage-footer'>
        <Footer />
      </div>
    </div>
  );
}
