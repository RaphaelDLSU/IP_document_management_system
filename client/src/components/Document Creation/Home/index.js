import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CreateDocument from '../CreateDocument'
import BuildingSurface from "../Documents/BuildingSurface";
import TechnicalDescription from "../Documents/TechnicalDescription";
import TabulationArea from '../Documents/TabulationOfAreas';
import FactSheet from '../Documents/FactSheet'
 
function Home() {
    return (
      <div className="App">
        <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
        >
            <Tab eventKey="create" title="Create document">
                <CreateDocument />
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
                <FactSheet />
            </Tab>
        </Tabs>
    </div>
    );
}
 
export default Home;