// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import './Options/Options.css'

const ProjectSelector = props => {
    const { setState, actionProvider,func } = props;

    const options = [
        {
          name: "Miramonti",
          id: 1
        },
        {
            name: "Monumento",
            id: 2
        },
        {
            name: "Montecristo",
            id: 3
        },
        {
            name: "Muramana",
            id: 4
        },
      ];

    const setFunction = async (name) =>{
        setState((state)=>({
            ...state,
            project:name,
        }))
        actionProvider.handleTaskDefinition(name,func)
    }

      return (
        <div className="options">
          <h1 className="options-header">{props.title}</h1>
          <div className="options-container">
            {options.map(option => {
              return (
                <div
                  className="option-item"
                  onClick={()=>setFunction(option.name)}
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