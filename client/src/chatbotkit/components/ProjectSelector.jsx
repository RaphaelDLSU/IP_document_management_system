// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import './Options/Options.css'
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'

const ProjectSelector = props => {
  const { setState, actionProvider, func } = props;
  const [projects, setProjects] = useState([])

  const database = getFirestore()

  const setFunction = async (name) => {
    setState((state) => ({
      ...state,
      project: name,
    }))
    actionProvider.handleTaskDefinition(name, func)
  }

  useEffect(() => {
    const getProjects = async () => {
      const q = query(collection(database, 'projects'))
      await getDocs(q).then((project) => {
        let projectData = project.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setProjects(projectData)
      }).catch((err) => {
        console.log(err);
      })
    }
    getProjects()
  }, []);


  return (
    <div className="options">
      <h1 className="options-header">{props.title}</h1>
      <div className="options-container">
        {projects.map(option => {
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

export default ProjectSelector;