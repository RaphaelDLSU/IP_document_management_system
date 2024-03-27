// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import './Options/Options.css'

const FunctionSelector = props => {
  const { setState, actionProvider } = props;

  const options = [
    {
      name: "Task Request",
      id: 2
    },
    {
      name: "RFA Submission",
      id: 3
    },
    {
      name: "RFI Submission",
      id: 4
    },
  ];

  const setFunction = async (name) => {
    setState((state) => ({
      ...state,
      func: name,
    }))
    actionProvider.handleFunction(name)
  }

  return (
    <div className="options">
      <h1 className="options-header">{props.title}</h1>
      <div className="options-container">
        {options.map(option => {
          return (
            <div
              className="option-item"
              onClick={() => setFunction(option.name)}
              key={option.id}
            >
              {option.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunctionSelector;