//Bootstrap components
import { Col, Row, Form, Button } from 'react-bootstrap';

const ResidentialArea = ({ floorIndex, residentialArea, onResidentialAreaChange, onAddResidentialArea, onRemoveResidentialArea }) => {
    return (
        <>
            <Form.Group>
                <Row>
                    <Col>Unit No./Tag</Col>
                    <Col>Type</Col>
                    <Col>Unit Size (sqm)</Col>
                    <Col></Col>
                </Row>
            </Form.Group>
            {residentialArea.map((input, index) => {
                return (
                    <Form.Group key={index}>
                        <Row>
                            {/* Show index/row number */}

                            {/* Unit Type */}
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Unit Type"
                                    name="residentialAreaUnitType"
                                    value={input.residentialAreaUnitType}
                                    onChange={(e) => onResidentialAreaChange(floorIndex, index, 'residentialAreaUnitType', e.target.value)}
                                />
                            </Col>

                            {/* No. of Unit */}
                            <Col>
                                <Form.Select
                                    aria-label="Default select example"
                                    name="saleableAreaType"
                                    value={input.saleableAreaType}
                                    onChange={(e) => onResidentialAreaChange(floorIndex, index, 'residentialAreaNumberUnit', e.target.value)}                                    required
                                >
                                    <option value="">Select saleable area type</option>
                                    <option value="1 Bedroom">1 Bedroom</option>
                                    <option value="2 Bedroom">2 Bedroom</option>
                                    <option value="Penthouse">Penthouse</option>
                                </Form.Select>
                            </Col>

                            {/* Unit size */}
                            <Col>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="Area (sqm)"
                                    name="residentialAreaSize"
                                    value={input.residentialAreaSize}
                                    onChange={(e) => onResidentialAreaChange(floorIndex, index, 'residentialAreaSize', e.target.value)}
                                    required
                                />
                            </Col>

                            {/* Remove row button */}
                            <Col>
                                <Button variant='danger' onClick={() => onRemoveResidentialArea(floorIndex,index)}>
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                )
            })}
            <p></p>
            <Button variant="primary" onClick={() => onAddResidentialArea(floorIndex)}>
                Add row
            </Button>
        </>
    )
}

export default ResidentialArea;