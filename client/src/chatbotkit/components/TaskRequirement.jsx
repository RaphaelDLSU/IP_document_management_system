// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import { ConditionallyRender } from "react-util-kit";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import './styles.css'
import { autoAssign } from '../../redux/workload/autoAssign';
import { toast } from 'react-toastify';
import { createNotifs } from '../../redux/notifs/createNotif';
import { getEstimatedHours } from '../../redux/estimatedhours/getEstimatedHours';
const TaskRequirement = props => {
  const { setState, actionProvider, taskName, project, taskDeadline } = props;
  const [displaySelector, toggleDisplaySelector] = useState(true);
  const [task, setTask] = useState('');
  const [textBoxes, setTextBoxes] = useState(['']);
  const database = getFirestore()
  const dispatch = useDispatch();

  const { isLoggedIn, user, userId } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
      userId: state.auth.userId,
    }),
    shallowEqual
  );

  const addTextBox = () => {
    setTextBoxes([...textBoxes, '']);
  };

  const handleTextBoxChange = (index, value) => {




    const updatedTextBoxes = [...textBoxes];
    updatedTextBoxes[index] = value;
    setTextBoxes(updatedTextBoxes);
    console.log('TEXTBOXES: ' + textBoxes)
  };

  const handleSubmit = async () => {
    toast.info("Submitting Task Request. Please Wait")
    let requirements = []

    textBoxes.forEach(async (req) => {

      let object = {
        id: Math.random().toString(36).slice(2, 7),
        value: req
      }
      requirements.push(object)
    })

    console.log('Requirements" ' + JSON.stringify(requirements))

    const employeeId = dispatch(autoAssign({}))
    employeeId.then(async (something) => {
      const employeeRef = doc(database, "users", something)
      const employee = await getDoc(employeeRef)

      let startDate = new Date()
      let endDate = new Date(taskDeadline)
      endDate.setHours(0,0,0,0)
      const estHours = dispatch(getEstimatedHours({
        startDate: startDate,
        endDate: endDate
      }))
      estHours.then(async (estDeadline) => {

        const setTasksRef = collection(database, 'tasks')
        await addDoc(setTasksRef, {
          task: taskName,
          isChecked: false,
          timestamp: serverTimestamp(),
          deadline: endDate,
          employee: employee.data().name,
          employeeId: employee.data().email,
          requirements: requirements,
          status: 'for submission',
          approval: false,
          project: project,
          requestor: user.data.uid,
          requestorname: user.data.displayName,
          isRequest: true,
          hours: estDeadline
        }).then(() => {
          dispatch(createNotifs({
            title: 'NEW TASK REQUEST: ' + taskName,
            message: 'A request has been sent to you by ' + user.data.displayName + '. Please check the Tasks Manager Page for more information ',
            receiverID: employee.data().email,
            link: 'tasks'
          }))
          actionProvider.finishTaskCreator()
        })

      })


    })
  };

  const removeValueFromState = (index) => {
    const updatedTextBoxes = [...textBoxes];
    updatedTextBoxes.splice(index, 1);
    setTextBoxes(updatedTextBoxes);
  };

  return (
    <div className="airport-selector-container">
      <ConditionallyRender
        ifTrue={displaySelector}
        show={
          <>
            {textBoxes.map((value, index) => (
              <div key={index}>
                <input
                  required
                  type="text"
                  value={value}
                  onChange={(e) => handleTextBoxChange(index, e.target.value)}
                  placeholder="Type something..."
                />
              </div>
            ))}


            <button className="airport-button-confirm" onClick={addTextBox}>
              Add
            </button>
            <button className="airport-button-confirm" onClick={removeValueFromState}>
              Remove
            </button>
            <button className="airport-button-confirm" onClick={handleSubmit}>
              Confirm
            </button>
          </>
        }
        elseShow={
          <>
            <p>
              Great! You have named your task:
            </p>
          </>
        }
      />
    </div>
  );
};

export default TaskRequirement;