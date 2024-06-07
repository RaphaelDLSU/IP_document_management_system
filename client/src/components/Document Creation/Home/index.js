import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CreateDocument from '../CreateDocument'
import BuildingSurface from "../Documents/BuildingSurface";
import FactSheet from "../Documents/FactSheet";
import TechnicalDescription from "../Documents/TechnicalDescription";
import TabulationArea from '../Documents/TabulationOfAreas';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
 
function Home() {

    //Array of floors. Floors are identified by id that is created using uuid
    const [floors, setFloors] = useState([
        {
            id: uuidv4(),
            floorName: '',
            saleableArea: [
                {
                saleableAreaUnitNumberTag: '',
                saleableAreaType: '',
                saleableAreaSize: '',
                saleableAreaRemark: '',
                saleableAreaPriceSqm: '',
                saleableAreaUnitPrice: '',
                saleableAreaVAT: '',
                saleableAreaMiscFees: '',
                saleableAreaTotalPrice: ''
                }
            ],
            serviceArea: [
                {
                serviceAreaUnitNumberTag: '',
                serviceAreaType: '',
                serviceAreaSize: ''
                }
            ],
            parkingArea: [
                {
                parkingAreaUnitNumberTag: '',
                numberOfParking: '',
                parkingSlotSize: '',
                parkingTotalArea: ''
                }
            ],
            amenitiesArea: [
                {
                amenitiesAreaUnitNumberTag: '',
                amenitiesAreaType: '',
                amenitiesAreaSize: ''
                }
            ],
            residentialArea: [
                {
                residentialAreaUnitType: '',
                residentialAreaNumberUnit: '',
                residentialAreaSize: '',
                residentialTotalArea: ''
                }
            ]
        }
    ])

    /* SALEABLE AREA FUNCTIONS */
    //Saleable Area Form change handler
    const handleSaleableAreaChange = (floorIndex, areaIndex, field, value) => {
        const updatedFloors = [...floors];
        updatedFloors[floorIndex].saleableArea[areaIndex][field] = value;

        //Calculate Unit Price, VAT, Fees, and Total Price
        //Unit Price
        updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaUnitPrice =
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaPriceSqm *
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaSize;

        //VAT
        updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaVAT =
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaUnitPrice * 0.12;

        //Fees
        updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaMiscFees =
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaUnitPrice * 0.08;
            
        //Total
        updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaTotalPrice =
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaUnitPrice +
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaVAT +
            updatedFloors[floorIndex].saleableArea[areaIndex].saleableAreaMiscFees;

        setFloors(updatedFloors);
    };

    //For adding more inputs to Saleable Area
    const handleAddSaleableArea = (floorIndex) => {
        const newSaleableArea = {
        saleableAreaUnitNumberTag: '',
        saleableAreaType: '',
        saleableAreaSize: ''
        };
        const updatedFloors = [...floors];
        updatedFloors[floorIndex].saleableArea.push(newSaleableArea);
        setFloors(updatedFloors);
    };

    //For removing inputs from Saleable Area
    const handleRemoveSaleableArea = (floorIndex, areaIndex) => {
        const updatedFloors = [...floors];
        updatedFloors[floorIndex].saleableArea.splice(areaIndex, 1);
        setFloors(updatedFloors);
    };

    return (
      <div className="App">
        <Tabs
        defaultActiveKey="create"
        id="uncontrolled-tab-example"
        className="mb-3"
        >
            <Tab eventKey="create" title="Create document">
                <CreateDocument floors={floors} setFloors={setFloors} handleSaleableAreaChange={handleSaleableAreaChange} handleAddSaleableArea={handleAddSaleableArea} handleRemoveSaleableArea={handleRemoveSaleableArea}/>
            </Tab>
            <Tab eventKey="buildingsurface" title="Building Surface">
                <BuildingSurface />
            </Tab>
            <Tab eventKey="technicaldescription" title="Technical Description">
                <TechnicalDescription />
            </Tab>
            <Tab eventKey="tabulation" title="Tabulation of Areas">
                <TabulationArea />
            </Tab>
            <Tab eventKey="factsheet" title="Fact Sheet">
                <FactSheet handleSaleableAreaChange={handleSaleableAreaChange} handleAddSaleableArea={handleAddSaleableArea} handleRemoveSaleableArea={handleRemoveSaleableArea}/>
            </Tab>
        </Tabs>
    </div>
    );
}
 
export default Home;