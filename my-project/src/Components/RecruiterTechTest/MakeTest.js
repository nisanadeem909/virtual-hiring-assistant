import React, { useState } from 'react';

function QuestionForm({ addQuestion }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Initial options

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((option, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedOptions = options.map((option) => option.trim()).filter((option) => option !== '');
    addQuestion({ question: question.trim(), options: trimmedOptions });
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Question:
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </label>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveOption(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddOption}>
        Add Option
      </button>
      <button type="submit">Add Question</button>
    </form>
  );
}

function App() {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div>
      <h1>Technical Test</h1>
      <QuestionForm addQuestion={addQuestion} />
      <hr />
      <h2>Questions:</h2>
      {questions.map((q, index) => (
        <div key={index}>
          <p>{q.question}</p>
          <ul>
            {q.options.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
