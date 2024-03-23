// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';

const FileRequestOptions = props => {

    const options = [
        {
          name: "Building Surface",
          handler: props.actionProvider.handleFileRequestOptions,
          id: 1
        },
        { name: "Submit task",
         handler: props.actionProvider.handleSubmitTask,
          id: 2 },
        {
          name: "RFA submission",
          handler: props.actionProvider.handleRFASubmission,
          id: 3
        },
        {
          name: "RFI submission",
          handler: props.actionProvider.handleRFISubmission,
          id: 4
        }
      ];

  return (
    <div>
      <Options options={options} title="Options" {...props}/>
    </div>
  );
};

export default FunctionSelector;