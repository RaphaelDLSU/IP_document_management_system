import React from "react";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AmenitiesArea = () => {
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
                <tr>
                    <td>1</td>
                    <td>C01</td>
                    <td>Commercial Retail</td>
                    <td>10</td>
                </tr>
                <tr>
                    <td colSpan={3}>TOTAL</td>
                    <td>60</td>
                </tr>
                </tbody>
            </Table>
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Control placeholder="Unit No./Tag" />
                    </Col>
                    <Col>
                        <Form.Select aria-label="Default select example">
                            <option>Select amenities area type</option>
                            <option value="Multifunction Room">Multifunction Room</option>
                            <option value="Spa">Spa</option>
                            <option value="Gym">Gym</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Control placeholder="Area (sqm)" />
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

export default AmenitiesArea;