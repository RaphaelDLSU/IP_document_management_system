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

import ExcelJS from 'exceljs'
import saveAs from 'file-saver'
 
function Home() {

    //Array of floors. Floors are identified by id that is created using uuid
    const [floors, setFloors] = useState([
        {
            id: uuidv4(),
            floorName: '',
            saleableArea: [
       
            ],
            serviceArea: [

            ],
            parkingArea: [

            ],
            amenitiesArea: [
          
            ],
            residentialArea: [
           
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

    const handleExport = () => {
        //Get HTML table element by Id
        const htmlTable = document.getElementById('myTable')

        //Create workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1')

        //Add column names to worksheet
        const headerRow = worksheet.addRow([])
        const headerCells = htmlTable.getElementsByTagName('th')
        for (let i = 0; i < headerCells.length - 1; i++) {
            headerRow.getCell(i + 1).value = headerCells[i].innerText
        }

        //Add HTML table data to worksheet
        const rows = htmlTable.getElementsByTagName('tr')
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td')
            const rowData = []
            for (let j=0; j < cells.length; j++) {
                if(cells[j].innerText !== 'Edit' && cells[j].innerText !== 'Update  Cancel')
                    rowData.push(cells[j].innerText)
            }
            worksheet.addRow(rowData)
        }

        // Export to Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'FactSheet.xlsx'); // Use the 'file-saver' library for download
        });
    }

    return (
      <div className="App" style={{ padding: '20px', maxWidth: '70%', margin: 'auto', backgroundColor: '#FFFFFF', borderStyle: 'solid', borderTop: '0px', borderColor: '#959595', borderWidth: '2px' }}>
        <Tabs
        defaultActiveKey="create"
        id="uncontrolled-tab-example"
        className="mb-3"
        >
            <Tab eventKey="create" title="Create document">
                <CreateDocument floors={floors} setFloors={setFloors} handleSaleableAreaChange={handleSaleableAreaChange} handleAddSaleableArea={handleAddSaleableArea} handleRemoveSaleableArea={handleRemoveSaleableArea}/>
            </Tab>
            <Tab eventKey="buildingsurface" title="View Documents">
                <BuildingSurface />
            </Tab>
             {/*
            <Tab eventKey="technicaldescription" title="Technical Description">
                <TechnicalDescription />
            </Tab>
            <Tab eventKey="tabulation" title="Tabulation of Areas">
                <TabulationArea />
            </Tab>
            <Tab eventKey="factsheet" title="Fact Sheet">
                <FactSheet onSaleableAreaChange={handleSaleableAreaChange} onHandleExport={handleExport} />
            </Tab> */}
        </Tabs>
    </div>
    );
}
 
export default Home;