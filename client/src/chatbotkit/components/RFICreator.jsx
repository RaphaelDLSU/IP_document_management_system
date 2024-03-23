// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import { ConditionallyRender } from "react-util-kit";
import './styles.css'
const RFICreator = props => {

    const { setState, actionProvider, taskName } = props;
    const [displaySelector, toggleDisplaySelector] = useState(true);
    const [query, setQuery] = useState('');


    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = () => {
        setState((state) => ({
            ...state,
            rfiDesc: query
        }));
        toggleDisplaySelector((prevState) => !prevState);
        actionProvider.handleRFIImages();
    };

    return (
        <div  className="airport-selector-container">
            <ConditionallyRender
                ifTrue={displaySelector}
                show={
                    <>
                        {" "}
                        <h2 className="airport-selector-heading">RFI Query</h2>
                        <input
                            type="text"
                            placeholder="Query ..."
                            onChange={(e) => handleChange(e)}
                        />
                        <button className="airport-button-confirm" onClick={handleSubmit}>
                            Confirm
                        </button>

                    </>
                }
                elseShow={
                    <>
                        <p>
                            Great! Your RFI Query is: {query}
                        </p>
                    </>
                }
            />
        </div>
    );
};

export default RFICreator;