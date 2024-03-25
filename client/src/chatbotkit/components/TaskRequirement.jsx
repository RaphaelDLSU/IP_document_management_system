// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import { ConditionallyRender } from "react-util-kit";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { where,collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp,getFirestore, updateDoc,arrayUnion,getDoc,deleteDoc, setDoc} from 'firebase/firestore'
import './styles.css'
const TaskRequirement = props => {
    const { setState, actionProvider,taskName,project } = props;
    const [displaySelector, toggleDisplaySelector] = useState(true);
    const [task, setTask] = useState('');
    const [textBoxes, setTextBoxes] = useState(['']);
    const database = getFirestore()

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
        console.log('TEXTBOXES: '+textBoxes)
    };
    
    const handleSubmit = async () => {

      let requirements = []

      textBoxes.forEach(async (req) =>{

        let object = {
          id:Math.random().toString(36).slice(2, 7),
          value:req
        }
        requirements.push(object)
      })

      console.log('Requirements" '+JSON.stringify(requirements))

      for (let i = 0; i < 30; i++) {
        const q = query(collection(database, "users"), where("tasks", "==", i),where('role','==','Employee'));

        if(q){
          const querySnapshot = await getDocs(q);

          for (var j in querySnapshot.docs) {
            const doc1 = querySnapshot.docs[j]

            const setTasksRef = doc(database,'tasks',Math.random().toString(36).slice(2, 7))
            await setDoc(setTasksRef, {
              task: taskName,
              isChecked: false,
              timestamp: serverTimestamp(),
              deadline: 'None',
              employee: doc1.data().name,
              employeeId: doc1.data().email,
              requirements:requirements,
              status: 'for submission',
              approval: false,
              workflow: '',
              workflowname:'',
              approvalTo:'',
              project:project,
              requestor:user.data.uid,
              requestorname:user.data.displayName,
              isRequest: true
            })
            const userRef = doc(database, "users", doc1.id);
            await updateDoc(userRef, {
              tasks: doc1.data().tasks + 1
            })
            console.log('break')
            break
          }
          console.log('return')
          break
        }
        

      }

      
      actionProvider.finishTaskCreator()
       
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