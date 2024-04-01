// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import { ConditionallyRender } from "react-util-kit";
import './styles.css'
const RFICreator = props => {

    const { setState, actionProvider, taskName } = props;
    const [displaySelector, toggleDisplaySelector] = useState(true);
    const [query, setQuery] = useState('');
    const [deadline, setDeadline] = useState();

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = () => {
        setState((state) => ({
            ...state,
            rfiDesc: query,
            rfiDeadline:deadline
        }));
        toggleDisplaySelector((prevState) => !prevState);
        actionProvider.handleRFIImages();
    };

    return (
        <div className="airport-selector-container">
            <ConditionallyRender
                ifTrue={displaySelector}
                show={
                    <>
                        {" "}
                        <h2 className="airport-selector-heading">RFI Query</h2>
                        <textarea required onChange={(e) => handleChange(e)}>
                        </textarea>
                        <h2 className="airport-selector-heading">Deadline</h2>

                        <input required type="date" id="myDateInput" name="myDate" onChange={(e) => setDeadline(e.target.value)} />
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