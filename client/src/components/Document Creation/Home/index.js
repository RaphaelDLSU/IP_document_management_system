import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc, QueryConstraint } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";

//Bootstrap components
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

//Import forms
import ServiceArea from "../Forms/ServiceArea";
import SaleableArea from "../Forms/SaleableArea";
import ParkingArea from "../Forms/ParkingArea";
import { AccordionItem } from "react-bootstrap";
import AmenitiesArea from "../Forms/AmenitiesArea";
import ResidentialArea from "../Forms/ResidentialArea";

const DocumentCreation = () => {
    const database = getFirestore()
    const [loading, setLoading] = useState(true)

    const [open, setOpen] = useState(false);

    const [inputs, setInputs] = useState({});
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [sum, setSum] = useState('');
    const [show, setShow] = useState(false);
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data:', inputs);

        const documentRef = collection(database,'buildingSurface')

        await addDoc(documentRef,{
            inputs:inputs
        })
    };

    const addition = (e, inputNumber) => {
        const inputValue = e.target.value;

        if (inputNumber === 'number1') {
            setNumber1(inputValue);
        } else if (inputNumber === 'number2') {
            setNumber2(inputValue);
        }

        const result = Number(number1) + Number(number2);
        setSum(result);
    }
    
    const handleAddition = (number1, number2) => {
        const sum = Number(number1) + Number(number2);
            setSum(sum);
    };

    const submitTask = async (e) => {
        // e.preventDefault();
        // console.log('WAHEHE')

        // console.log('INPUTS' + JSON.stringify(inputs))
        // for (const input of inputs) {
        //     console.log(input.employee)
        //     const taskRef = collection(database, "tasks");

        //     const q = query(collection(database, "users"), where("email", "==", input.employee));

        //     console.log('there are inputs :)')
        //     const querySnapshot = await getDocs(q);
        //     querySnapshot.forEach(async (user) => {

        //         let approvalTemp = false
        //         let isApproval = ''
        //         if (approval == '') {
        //             approvalTemp = 'Manager and CEO'
        //             isApproval = true
        //         }
        //         await addDoc(taskRef, {
        //             approval: isApproval,
        //             approvalTo: approvalTemp,
        //             employee: user.data().name,
        //             employeeId: user.data().email,
        //             project: project,
        //             requirements: [{ value: input.requirement, id: Math.random().toString(36).slice(2, 7) }],
        //             status: 'for submission',
        //             task: plan,
        //             timestamp: new Date(),
        //             stage: stage,
        //             hours: hours,
        //             deadline: deadline,
        //             workflowname: workflowOfStage,
        //             workflow: workflowIdOfStage
        //         })
        //     });

        // }
        // console.log('finished')
    };

    return (
        <div className="form" style={{ padding: '20px' }}>
            <h2>Document Creation</h2> 
            <p>Create Building Surface Document</p>
            <Button onClick={() => setShow(true)}>Add Floor</Button>
            <hr></hr>
            <Form onSubmit={handleSubmit}>
                <div className="fullForm">
                    <h3>Ground Floor</h3>
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Description of the Saleable Area</Accordion.Header>
                            <Accordion.Body>   
                                <SaleableArea></SaleableArea>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Description of the Service Area</Accordion.Header>
                            <Accordion.Body>
                                <ServiceArea></ServiceArea>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Parking Area</Accordion.Header>
                            <Accordion.Body>
                                <ParkingArea></ParkingArea>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Description of the Amenities Area</Accordion.Header>
                            <Accordion.Body>
                                <AmenitiesArea></AmenitiesArea>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Description of the Residential Area</Accordion.Header>
                            <Accordion.Body>
                                <ResidentialArea></ResidentialArea>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Form>
        </div>

        // <form onSubmit={handleSubmit}>
        //   <label>
        //     Project Name:
        //     <input
        //       type="text"
        //       name="projectName"
        //       value={inputs.projectName || ""}
        //       onChange={handleChange}
        //     />
        //   </label>
        //   <br />
        //   <label>
        //     Location:
        //     <input
        //       type="text"
        //       name="location"
        //       value={inputs.location || ""}
        //       onChange={handleChange}
        //     />
        //   </label>
        //   <fieldset class="buildingSurface">
        //     <legend>Total Building Surface</legend>
        //     <label>Lot area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="lotArea"
        //          value={inputs.lotArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Total Gross Floor Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="totalGrossFloorArea"
        //          value={inputs.totalGrossFloorArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <br />
        //     <p>Commercial</p>
        //     <label>Commercial Gross Floor Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="commercialGrossFloorArea"
        //          value={inputs.commercialGrossFloorArea || ""}
        //          onChange={handleChange}
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Commercial Saleable Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="commercialSaleableArea"
        //          value={inputs.commercialSaleableArea || ""}
        //          onChange={handleChange} 
        //         /> sqm */}
        //         <input 
        //         type="number"
        //         value={number1}
        //         onChange={(e) => addition(e, 'number1')}
        //         />
        //     </label>
        //     <br />
        //     <label>Commercial Service Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="commercialServiceArea"
        //          value={inputs.commercialServiceArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Efficiency Ratio: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="commercialEfficiencyRatio"
        //          value={inputs.commercialEfficiencyRatio || ""}
        //          onChange={handleChange} 
        //         /> [%]
        //     </label>
        //     <br />
        //     <label>Number of Commercial Units: 
        //         <input
        //          type="number"
        //          name="commercialUnits"
        //          value={inputs.commercialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of Parking Slots: 
        //         <input
        //          type="number"
        //          name="commercialParkingSlots"
        //          value={inputs.commercialParkingSlots || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <br />
        //     <p>Residential</p>
        //     <label>Residential Gross Floor Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="residentialGrossFloorArea"
        //          value={inputs.residentialGrossFloorArea || ""}
        //          onChange={handleChange}
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Residential Saleable Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="residentialSaleableArea"
        //          value={inputs.residentialSaleableArea || ""}
        //          onChange={handleChange} 
        //         /> sqm */}
        //         <input 
        //         type="number"
        //         value={number2}
        //         onChange={(e) => addition(e, 'number2')}
        //         />
        //     </label>
        //     <br />
        //     <label>Residential Service Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="residentialServiceArea"
        //          value={inputs.residentialServiceArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Efficiency Ratio: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="residentialEfficiencyRatio"
        //          value={inputs.residentialEfficiencyRatio || ""}
        //          onChange={handleChange} 
        //         /> [%]
        //     </label>
        //     <br />
        //     <label>Number of Residential Units: 
        //         <input
        //          type="number"
        //          name="residentialUnits"
        //          value={inputs.residentialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of Studio Units: 
        //         <input
        //          type="number"
        //          name="studioUnits"
        //          value={inputs.studioUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of 1 Bedroom Units: 
        //         <input
        //          type="number"
        //          name="oneBedroomUnits"
        //          value={inputs.oneBedroomUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of Parking Slots: 
        //         <input
        //          type="number"
        //          name="residentialParkingSlots"
        //          value={inputs.residentialParkingSlots || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <br />
        //     <p>Gross and Total Values</p>
        //     <label>Gross Saleable Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="grossSaleableArea"
        //          value={inputs.grossSaleableArea || ""}
        //          onChange={handleChange}
        //         /> sqm */}
        //         <p>{sum}</p>
        //     </label>
        //     <br />
        //     <label>Gross Service Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="grossServiceArea"
        //          value={inputs.grossServiceArea || ""}
        //          onChange={handleChange} 
        //         /> sqm */}
        //     </label>
        //     <br />
        //     <label>Efficiency Ratio: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="grossEfficiencyRatio"
        //          value={inputs.grossEfficiencyRatio || ""}
        //          onChange={handleChange} 
        //         /> [%]
        //     </label>
        //     <br />
        //     <label>Total Number of Commercial Units: 
        //         <input
        //          type="number"
        //          name="totalCommercialUnits"
        //          value={inputs.totalCommercialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of Residential Units: 
        //         <input
        //          type="number"
        //          name="totalResidentialUnits"
        //          value={inputs.totalResidentialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of Studio Units: 
        //         <input
        //          type="number"
        //          name="totalStudioUnits"
        //          value={inputs.totalStudioUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of 1 Bedroom Units: 
        //         <input
        //          type="number"
        //          name="totalOneBedroomUnits"
        //          value={inputs.totalOneBedroomUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of Parking Slots: 
        //         <input
        //          type="number"
        //          name="totalParkingSlots"
        //          value={inputs.totalParkingSlots || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //   </fieldset>
        //   <br />
        //   <input type="submit" />
        // </form>
    );
};

export default DocumentCreation;
