import React, {useState, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReadOnlyRow from "../ReadOnlyRow";

const ServiceArea = () => {
    const [inputs, setInputs] = useState([])
    const [editContactId, setEditContactId] = useState(null);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleAdd = async (event) => {
        event.preventDefault();
        console.log('Form data:', inputs);
    };

    const handleEditClick = (event, input) => {
        event.preventDefault();
        setEditContactId(input.id);
    
        const formValues = {
          unitNumberTag: input.unitNumberTag,
          serviceAreaType: input.serviceAreaType,
          serviceAreaSize: input.serviceAreaSize
        };
    };

    const handleDeleteClick = (inputId) => {
        const newInputs = [...inputs];
    
        const index = inputs.findIndex((input) => input.id === inputId);
    
        newInputs.splice(index, 1);
    
        setInputs(newInputs);
      };
    
      const getTotals = (inputs, key) => {
        let total = 0;
    
        (inputs.area).forEach(item => {
          total += item[key];
        });
    
        return total;
      };

    return (
        <div className="floorForm">
            <Table striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Unit No./Tag</th>
                    <th>Type</th>
                    <th>Area (sqm)</th>
                </tr>
                </thead>
                <tbody>
                    {inputs.map((input) => (
                        <Fragment>
                            <ReadOnlyRow 
                                input={input}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        </Fragment>
                    ))}
                </tbody>
            </Table>
            <Form.Group onSubmit={handleAdd}>
                <Row>
                    <Col>
                        <Form.Control 
                            placeholder="Unit No./Tag"
                            name="unitNumberTag"
                            value={inputs.unitNumberTag || ""}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col>
                        <Form.Select 
                            aria-label="Default select example"
                            name="serviceAreaType"
                            value={inputs.serviceAreaType || ""}
                            onChnage={handleChange}
                        >
                            <option>Select service area type</option>
                            <option value="Roadway/Common Area">Roadway/Common Area</option>
                            <option value="Stairs">Stairs</option>
                            <option value="Transformer Room">Transformer Room</option>
                            <option value="Generator Room">Generator Room</option>
                            <option value="Ramp">Ramp</option>
                            <option value="Lobby/Hallway">Lobby/Hallway</option>
                            <option value="Residential Lobby">Residential Lobby</option>
                            <option value="Corridors">Corridors</option>
                            <option value="Fire Stairs">Fire Stairs</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Control 
                            placeholder="Area (sqm)" 
                            name="serviceAreaSize"
                            value={inputs.serviceAreaSize || ""}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </div>
    );
}

export default ServiceArea;