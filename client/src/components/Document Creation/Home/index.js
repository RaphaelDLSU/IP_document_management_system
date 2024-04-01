import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CreateDocument from '../CreateDocument'
import BuildingSurface from "../Documents/BuildingSurface";
 
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
                Tab content for Contact
            </Tab>
            <Tab eventKey="tabulation" title="Tabulation of Areas">
                Tab content for Contact
            </Tab>
            <Tab eventKey="factsheet" title="Fact Sheet">
                Tab content for Contact
            </Tab>
        </Tabs>
    </div>
    );
}
 
export default Home;