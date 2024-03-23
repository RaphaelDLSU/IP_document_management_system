import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";

const DocumentCreation = () => {
      const [inputs, setInputs] = useState({});
      const database = getFirestore()
    
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
    
      return (
        <form onSubmit={handleSubmit}>
          <label>
            Project Name:
            <input
              type="text"
              name="projectName"
              value={inputs.projectName || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={inputs.location || ""}
              onChange={handleChange}
            />
          </label>
          <fieldset class="buildingSurface">
            <legend>Total Building Surface</legend>
            <label>Lot area: 
                <input
                 type="number"
                 step="0.01"
                 name="lotArea"
                 value={inputs.lotArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <label>Total Gross Floor Area: 
                <input
                 type="number"
                 step="0.01"
                 name="totalGrossFloorArea"
                 value={inputs.totalGrossFloorArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <br />
            <p>Commercial</p>
            <label>Commercial Gross Floor Area: 
                <input
                 type="number"
                 step="0.01"
                 name="commercialGrossFloorArea"
                 value={inputs.commercialGrossFloorArea || ""}
                 onChange={handleChange}
                /> sqm
            </label>
            <br />
            <label>Commercial Saleable Area: 
                <input
                 type="number"
                 step="0.01"
                 name="commercialSaleableArea"
                 value={inputs.commercialSaleableArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <label>Commercial Service Area: 
                <input
                 type="number"
                 step="0.01"
                 name="commercialServiceArea"
                 value={inputs.commercialServiceArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <label>Efficiency Ratio: 
                <input
                 type="number"
                 step="0.01"
                 name="efficiencyRatio"
                 value={inputs.efficiencyRatio || ""}
                 onChange={handleChange} 
                /> [%]
            </label>
            <br />
            <label>Number of Commercial Units: 
                <input
                 type="number"
                 name="commercialUnits"
                 value={inputs.commercialUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Number of Parking Slots: 
                <input
                 type="number"
                 name="commercialParkingSlots"
                 value={inputs.commercialParkingSlots || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <br />
            <p>Residential</p>
            <label>Residential Gross Floor Area: 
                <input
                 type="number"
                 step="0.01"
                 name="residentialGrossFloorArea"
                 value={inputs.residentialGrossFloorArea || ""}
                 onChange={handleChange}
                /> sqm
            </label>
            <br />
            <label>Residential Saleable Area: 
                <input
                 type="number"
                 step="0.01"
                 name="residentialSaleableArea"
                 value={inputs.residentialSaleableArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <label>Residential Service Area: 
                <input
                 type="number"
                 step="0.01"
                 name="residentialServiceArea"
                 value={inputs.residentialServiceArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <label>Efficiency Ratio: 
                <input
                 type="number"
                 step="0.01"
                 name="efficiencyRatio"
                 value={inputs.efficiencyRatio || ""}
                 onChange={handleChange} 
                /> [%]
            </label>
            <br />
            <label>Number of Residential Units: 
                <input
                 type="number"
                 name="residentialUnits"
                 value={inputs.residentialUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Number of Studio Units: 
                <input
                 type="number"
                 name="studioUnits"
                 value={inputs.studioUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Number of 1 Bedroom Units: 
                <input
                 type="number"
                 name="oneBedroomUnits"
                 value={inputs.oneBedroomUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Number of Parking Slots: 
                <input
                 type="number"
                 name="residentialParkingSlots"
                 value={inputs.residentialParkingSlots || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <br />
            <p>Gross and Total Values</p>
            <label>Gross Saleable Area: 
                <input
                 type="number"
                 step="0.01"
                 name="grossSaleableArea"
                 value={inputs.grossSaleableArea || ""}
                 onChange={handleChange}
                /> sqm
            </label>
            <br />
            <label>Gross Service Area: 
                <input
                 type="number"
                 step="0.01"
                 name="grossServiceArea"
                 value={inputs.grossServiceArea || ""}
                 onChange={handleChange} 
                /> sqm
            </label>
            <br />
            <label>Efficiency Ratio: 
                <input
                 type="number"
                 step="0.01"
                 name="efficiencyRatio"
                 value={inputs.efficiencyRatio || ""}
                 onChange={handleChange} 
                /> [%]
            </label>
            <br />
            <label>Total Number of Commercial Units: 
                <input
                 type="number"
                 name="totalCommercialUnits"
                 value={inputs.totalCommercialUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Total Number of Residential Units: 
                <input
                 type="number"
                 name="totalResidentialUnits"
                 value={inputs.totalResidentialUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Total Number of Studio Units: 
                <input
                 type="number"
                 name="totalStudioUnits"
                 value={inputs.totalStudioUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Total Number of 1 Bedroom Units: 
                <input
                 type="number"
                 name="totalOneBedroomUnits"
                 value={inputs.totalOneBedroomUnits || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
            <label>Total Number of Parking Slots: 
                <input
                 type="number"
                 name="totalParkingSlots"
                 value={inputs.totalParkingSlots || ""}
                 onChange={handleChange} 
                />
            </label>
            <br />
          </fieldset>
          <br />
          <input type="submit" />
        </form>
      );
};

export default DocumentCreation;
