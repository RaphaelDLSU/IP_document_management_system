import React from "react";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ResidentialArea = () => {
    return (
        <div className="floorForm">
            <Table striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Unit Type</th>
                    <th>No. of Units</th>
                    <th>Unit size (sqm)</th>
                    <th>Total Area (sqm)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>C01</td>
                    <td>5</td>
                    <td>10</td>
                    <td>10</td>
                </tr>
                <tr>
                    <td colSpan={2}>TOTAL</td>
                    <td colSpan={2}>60</td>
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
                        <Form.Control placeholder="No. of Units" />
                    </Col>
                    <Col>
                        <Form.Control placeholder="Unit Size (sqm)" />
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

export default ResidentialArea;