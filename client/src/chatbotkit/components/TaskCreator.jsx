// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import { ConditionallyRender } from "react-util-kit";
import './styles.css'
const TaskCreator = props => {
  const { setState, actionProvider, taskName } = props;
  const [displaySelector, toggleDisplaySelector] = useState(true);
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState();
  const [isCustom, setIsCustom] = useState(false);

  const handleChange = (e) => {

    if (e.target.value == 'Custom') {
      setIsCustom(true)
    } else {
      setTask(e.target.value);
    }

  };

  const handleSubmit = () => {
    setState((state) => ({
      ...state,
      taskName: task,
      taskDeadline: deadline
    }));
    toggleDisplaySelector((prevState) => !prevState);
    actionProvider.handleTaskRequirements();
  };
  return (
    <div className="airport-selector-container">
      <ConditionallyRender
        ifTrue={displaySelector}
        show={
          <>
            {" "}
            <h2 className="airport-selector-heading">Task Name</h2>
            {!isCustom && (
              <select required  onChange={(event) => handleChange(event)}>
                <option value="" disabled selected hidden>Select Task Name</option>
                <option value="Custom">Custom</option>
                <option value="Send Elevation Plan">Send Elevation Plan</option>
                <option value="Send Section Plan">Send Section Plan</option>
                <option value="Send Stair Plan">Send Stair Plan</option>
                <option value="Send Hallway Plan">Send Hallway Plan</option>
                <option value="Send Floor Plan">Send Floor Plan</option>
                <option value="Send Ceiling Plan">Send Ceiling Plan</option>
              </select>
            )}
            {isCustom && (
              <input
                type="text"
                placeholder="Task Name.."
                onChange={(e) => handleChange(e)}
              />
            )}

            <h2 className="airport-selector-heading">Deadline</h2>

            <input type="date" id="myDateInput" name="myDate" onChange={(e) => setDeadline(e.target.value)} />
            <button className="airport-button-confirm" onClick={handleSubmit}>
              Confirm
            </button>

          </>
        }
        elseShow={
          <>
            <p>
              Great! You have named your task: {task}
            </p>
          </>
        }
      />
    </div>
  );
};

export default TaskCreator;